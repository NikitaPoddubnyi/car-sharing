import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { Location } from '@prisma/client';

@Injectable()
export class LocationService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    return await this.prismaService.location.findMany();
  }

  async findOne(id: string): Promise<Location> {
    const location = await this.prismaService.location.findUnique({
      where: { id },
    });

    if (!location) throw new NotFoundException('Location not found');

    return location;
  }

  async create(dto: CreateLocationDto) {
    return await this.prismaService.location.create({ data: dto });
  }

  async delete(id: string): Promise<boolean> {
    await this.findOne(id);
    await this.prismaService.location.delete({ where: { id } });
    return true;
  }
}
