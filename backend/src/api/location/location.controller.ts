import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { Authorization } from 'src/common/decorators';
import { UserRole } from '@prisma/client';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get()
  async findAll() {
    return await this.locationService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.locationService.findOne(id);
  }

  @Post()
  @Authorization(UserRole.ADMIN)
  async create(@Body() dto: CreateLocationDto) {
    return await this.locationService.create(dto);
  }

  @Delete(':id')
  @Authorization(UserRole.ADMIN)
  async delete(@Param('id') id: string) {
    return await this.locationService.delete(id);
  }
}
