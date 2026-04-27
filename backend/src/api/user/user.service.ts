import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DriverLicense, Prisma, User, UserAvatar } from '@prisma/client';
import type { Response } from 'express';
import { getPublicId, PasswordHelper } from 'src/common/helpers';
import { CalculateAge } from 'src/common/helpers/calculate-age.helper';
import { CloudinaryService } from 'src/infra/claudinary/claudinary.service';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import {
  CompleteProfileDto,
  GetReferralCodeDto,
  SetLicenseStatusDto,
  UpdateLicenseDto,
  UpdateUserDto,
} from './dto';
import { PurgeUserService } from './services/purge-user.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cloudinary: CloudinaryService,
    private readonly authService: AuthService,
    private readonly purgeUserService: PurgeUserService
  ) {}


  async findById(id: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      include: {
        license: true,
        avatar: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getReferralCode(dto: GetReferralCodeDto) {
    const { email, phone } = dto;
    const user = await this.prismaService.user.findFirst({
      where: {
        AND: [{ email: email }, { phone: phone }],
      },
    });

    if (!user) {
      return {
        exists: false,
        referralCode: null,
      };
    }

    return {
      exists: true,
      referralCode: user.referralCode,
    };
  }

  async findAll(page = 1, limit = 20): Promise<{ items: User[]; meta: any }> {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prismaService.user.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prismaService.user.count(),
    ]);

    return {
      items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async updateAvatar(
    userId: string,
    file: Express.Multer.File,
  ): Promise<Pick<UserAvatar, 'url'>> {
    try {
      if (!file) {
        throw new BadRequestException('No file uploaded');
      }

      const existAvatar = await this.prismaService.userAvatar.findUnique({
        where: {
          userId: userId,
        },
      });

      if (existAvatar) {
        try {
          await this.cloudinary.deleteFile(
            existAvatar.url.split('/').slice(-2).join('/').split('.')[0],
          );
        } catch (error) {}
      }
      const cloudResponse = await this.cloudinary.uploadFile(file, 'avatars');

      return this.prismaService.userAvatar.upsert({
        where: {
          userId: userId,
        },
        update: {
          url: cloudResponse.secure_url,
        },
        create: {
          url: cloudResponse.secure_url,
          userId: userId,
        },
        select: {
          url: true,
        },
      });
    } catch (error) {
      throw new BadRequestException('Error uploading file');
    }
  }

  async updateLicense(
    userId: string,
    dto: UpdateLicenseDto,
  ): Promise<DriverLicense> {
    const { licenseNumber, issueDate, expiryDate, country } = dto;

    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user?.birthDate) {
      throw new BadRequestException('User must have a birth date');
    }

    if (new Date(issueDate) >= new Date(expiryDate)) {
      throw new BadRequestException('Issue date must be before expiry date');
    }

    const existingLicense = await this.prismaService.driverLicense.findUnique({
      where: { licenseNumber },
    });

    if (existingLicense && existingLicense.userId !== userId) {
      throw new BadRequestException('License number already exists');
    }

    const data = {
      licenseNumber,
      issueDate: new Date(issueDate),
      expiryDate: new Date(expiryDate),
      country,
    };

    return this.prismaService.driverLicense.upsert({
      where: { userId },
      update: { ...data, status: 'PENDING' },
      create: { ...data, userId },
    });
  }

  async updateProfile(userId: string, dto: UpdateUserDto) {
    const { email, phone, password, firstName, lastName, birthDate } = dto;

    const existingUser = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    if (email && email !== existingUser.email) {
      const emailExists = await this.prismaService.user.findUnique({
        where: { email },
      });
      if (emailExists) {
        throw new BadRequestException('Email already in use');
      }
    }

    if (phone && phone !== existingUser.phone) {
      const phoneExists = await this.prismaService.user.findFirst({
        where: { phone },
      });
      if (phoneExists) {
        throw new BadRequestException('Phone number already in use');
      }
    }

    if (birthDate) {
      const age = CalculateAge(birthDate);
      if (age < 18) {
        throw new BadRequestException('User must be at least 18 years old');
      }
    }

    let hashedPassword: string | undefined;
    if (password) {
      hashedPassword = PasswordHelper.hashPassword(password);
    }

    const updateData: Prisma.UserUpdateInput = {
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(email && { email }),
      ...(phone && { phone }),
      ...(birthDate && { birthDate: new Date(birthDate) }),
      ...(hashedPassword && { password: hashedPassword }),
    };

    const updatedUser = await this.prismaService.user.update({
      where: { id: userId },
      data: updateData,
      include: {
        avatar: true,
        license: true,
      },
    });

    const { password: _, ...result } = updatedUser;
    return result;
  }

  async changeLicenseStatus(userId: string, dto: SetLicenseStatusDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { status } = dto;
    const license = await this.prismaService.driverLicense.findUnique({
      where: { userId },
    });

    if (!license) {
      throw new BadRequestException('This user does not have a license');
    }

    return await this.prismaService.driverLicense.update({
      where: { userId },
      data: { status },
    });
  }

  async updateLicenseImages(
    userId: string,
    files: { front?: Express.Multer.File[]; back?: Express.Multer.File[] },
  ): Promise<DriverLicense> {
    const license = await this.prismaService.driverLicense.findUnique({
      where: { userId },
    });

    if (!license) {
      throw new BadRequestException('At first you need to upload license');
    }

    const updateData: any = { status: 'PENDING' };

    if (files.front?.[0]) {
      if (license.frontImage) {
        const publicId = getPublicId(license.frontImage);
        await this.cloudinary.deleteFile(publicId).catch(() => {});
      }
      const uploaded = await this.cloudinary.uploadFile(
        files.front[0],
        'licenses',
      );
      updateData.frontImage = uploaded.secure_url;
    }

    if (files.back?.[0]) {
      if (license.backImage) {
        const publicId = getPublicId(license.backImage);
        await this.cloudinary.deleteFile(publicId).catch(() => {});
      }
      const uploaded = await this.cloudinary.uploadFile(
        files.back[0],
        'licenses',
      );
      updateData.backImage = uploaded.secure_url;
    }

    return this.prismaService.driverLicense.update({
      where: { userId },
      data: updateData,
    });
  }

  async completeProfile(userId: string, dto: CompleteProfileDto) {
    const { phone, birthDate } = dto;

    const age = CalculateAge(birthDate);

    const user = await this.prismaService.user.findUnique({
      where: { phone: phone },
    });

    if (user) {
      throw new BadRequestException('Phone number already exists');
    }

    if (age < 18) {
      throw new BadRequestException('User must be at least 18 years old');
    }

    const completedUser = await this.prismaService.user.update({
      where: { id: userId },
      data: {
        phone: phone,
        birthDate: new Date(birthDate),
      },
    });

    const { password, ...result } = completedUser;
    return result;
  }

  async deleteProfile(res: Response, userId: string): Promise<boolean> {
    await this.authService.logout(res);

    await this.purgeUserService.purgeUserData(userId);

    return true;
  }

  async deleteUser(userId: string): Promise<boolean> {
    await this.purgeUserService.purgeUserData(userId);
    return true;
  }
}
