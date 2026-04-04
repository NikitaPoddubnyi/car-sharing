import { BadRequestException, Injectable } from '@nestjs/common';
import { CloudinaryService } from 'src/infra/claudinary/claudinary.service';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { UpdateLicenseDto, CompleteProfileDto } from './dto';
import { CalculateAge } from 'src/common/helpers/calculate-age.helper';
import { AuthService } from '../auth/auth.service';
import type { Response } from 'express';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cloudinary: CloudinaryService,
	private readonly authService: AuthService,
  ) {}

  async findById(id: string) {
    return this.prismaService.user.findUnique({
      where: { id },
      include: {
        license: true,
        avatar: true,
      },
    });
  }

  async findAll() {
    return this.prismaService.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async updateAvatar(userId: string, file: Express.Multer.File) {
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

  async updateLicense(userId: string, dto: UpdateLicenseDto) {
    const { licenseNumber, issueDate, expiryDate, country } = dto;

    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

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

  async updateLicenseImages(
  userId: string,
  files: { front?: Express.Multer.File[]; back?: Express.Multer.File[] },
) {
  const license = await this.prismaService.driverLicense.findUnique({
    where: { userId },
  });

  if (!license) {
    throw new BadRequestException('At first you need to upload license');
  }

  const updateData: any = { status: 'PENDING' };

  if (files.front?.[0]) {
    if (license.frontImage) {
      const publicId = license.frontImage.split('/').slice(-2).join('/').split('.')[0];
      await this.cloudinary.deleteFile(publicId).catch(() => {});
    }
    const uploaded = await this.cloudinary.uploadFile(files.front[0], 'licenses');
    updateData.frontImage = uploaded.secure_url;
  }

  if (files.back?.[0]) {
    if (license.backImage) {
      const publicId = license.backImage.split('/').slice(-2).join('/').split('.')[0];
      await this.cloudinary.deleteFile(publicId).catch(() => {});
    }
    const uploaded = await this.cloudinary.uploadFile(files.back[0], 'licenses');
    updateData.backImage = uploaded.secure_url;
  }

  return this.prismaService.driverLicense.update({
    where: { userId },
    data: updateData,
  });
}

  async updateProfile(userId: string, dto: CompleteProfileDto) {
    const { phone, birthDate } = dto;

    const age = CalculateAge(birthDate);

    if (age < 18) {
      throw new BadRequestException('User must be at least 18 years old');
    }

    return this.prismaService.user.update({
      where: { id: userId },
      data: {
        phone: phone,
        birthDate: new Date(birthDate),
      },
    });
  }

async deleteProfile(res: Response, userId: string) {
  const user = await this.prismaService.user.findUnique({
    where: { id: userId },
    include: { avatar: true },
  });

  if (user?.avatar) {
    try {
      const publicId = user.avatar.url.split('/').slice(-2).join('/').split('.')[0];
      await this.cloudinary.deleteFile(publicId);
    } catch (error) {
    }
  }

  const result = this.prismaService.user.delete({
    where: { id: userId },
  });

  await this.authService.logout(res);

  return result;
}
}
