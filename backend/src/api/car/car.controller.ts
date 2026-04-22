import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { CarService } from './car.service';
import { Authorization, Authorized, Public } from 'src/common/decorators';
import { type User, UserRole, VehicleStatus } from '@prisma/client';
import { CreateCarDto } from './dto/create-car.dto';
import {
  FileFieldsInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import {
  UpdateCarAvailabilityDto,
  UpdateCarDto,
  UpdateCarStatusDto,
} from './dto';

@Controller('cars')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Public()
  @Get('all')
  async findAll(
    @Query('locationId') locationId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(12), ParseIntPipe) limit: number = 20,
  ) {
    return await this.carService.findAvailableCars(
      locationId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
      page,
      limit,
    );
  }

  @Get(':id/availability')
  async checkAvailability(
    @Param('id') id: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return await this.carService.checkCarAvailability(
      id,
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.carService.findOne(id);
  }

  @Get('admin/all')
  @Authorization(UserRole.ADMIN)
  async findAllForAdmin(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number = 20,
  ) {
    return this.carService.findAllForAdmin(page, limit);
  }

  @Authorization(UserRole.ADMIN)
  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateCarStatusDto) {
    return await this.carService.updateStatus(id, dto);
  }

  @Post()
  @Authorization(UserRole.USER, UserRole.ADMIN)
  @UseInterceptors(FilesInterceptor('images', 10))
  async create(
    @Body() dto: CreateCarDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp)' }),
        ],
      }),
    )
    files: Express.Multer.File[],
    @Authorized() user: User,
  ) {
    return await this.carService.create(
      dto,
      { images: files },
      user.id,
      user.role,
    );
  }

  @Patch(':id')
  @Authorization(UserRole.USER, UserRole.ADMIN)
  @UseInterceptors(FilesInterceptor('images', 10))
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCarDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp)' }),
        ],
        fileIsRequired: false,
      }),
    )
    files: Express.Multer.File[],
    @Authorized() user: User,
  ) {
    return this.carService.update(
      id,
      dto,
      { images: files },
      user.id,
      user.role,
    );
  }

  @Authorization(UserRole.ADMIN, UserRole.USER)
  @Patch(':id/images')
  @UseInterceptors(FilesInterceptor('images', 10))
  async updateImages(
    @Param('id') id: string,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp)' }),
        ],
      }),
    )
    files: Express.Multer.File[],
  ) {
    return this.carService.updateImages(id, { images: files });
  }

  @Authorization(UserRole.ADMIN)
  @Patch(':id/location')
  async updateLocation(
    @Param('id') id: string,
    @Body('locationId') locationId: string,
  ) {
    return this.carService.updateLocation(id, locationId);
  }

  @Authorization(UserRole.ADMIN)
  @Patch(':id/availability')
  async updateAvailability(
    @Param('id') id: string,
    @Body() dto: UpdateCarAvailabilityDto,
  ) {
    return this.carService.updateAvailability(id, dto);
  }

  @Authorization(UserRole.USER, UserRole.ADMIN)
  @Delete(':id')
  async delete(@Param('id') id: string, @Authorized() user: User) {
    return this.carService.delete(id, user.id, user.role);
  }
}
