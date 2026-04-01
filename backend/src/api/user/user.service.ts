import { BadRequestException, Injectable } from '@nestjs/common';
import { CloudinaryService } from 'src/infra/claudinary/claudinary.service';
import { PrismaService } from 'src/infra/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async findAll() {
    return this.prismaService.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async updateAvatar(userId: number, file: Express.Multer.File) {
    try {
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
}
