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
import { BikeService } from './bike.service';
import { type User, UserRole } from '@prisma/client';
import { Authorization, Authorized, Public } from 'src/common/decorators';
import {
  FileFieldsInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import {
  CreateBikeDto,
  UpdateBikeAvailabilityDto,
  UpdateBikeDto,
  UpdateBikeStatusDto,
} from './dto';

@Controller('bikes')
export class BikeController {
  constructor(private readonly bikeService: BikeService) {}

  @Public()
  @Get('all')
  async findAll(
    @Query('locationId') locationId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(12), ParseIntPipe) limit: number = 20,
  ) {
    return await this.bikeService.findAvailableBikes(
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
    return await this.bikeService.checkBikeAvailability(
      id,
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.bikeService.findOne(id);
  }

  @Get('admin/all')
  @Authorization(UserRole.ADMIN)
  async findAllForAdmin(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.bikeService.findAllForAdmin(page, limit);
  }

  @Authorization(UserRole.ADMIN)
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateBikeStatusDto,
  ) {
    return await this.bikeService.updateStatus(id, dto);
  }

  @Authorization()
  @Post()
  @UseInterceptors(FilesInterceptor('images', 10))
  async create(
    @Body() dto: CreateBikeDto,
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
    return await this.bikeService.create(
      dto,
      { images: files },
      user.id,
      user.role,
    );
  }

  @Authorization()
  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images', 10))
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateBikeDto,
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
    return this.bikeService.update(
      id,
      dto,
      { images: files },
      user.id,
      user.role,
    );
  }

  @Authorization()
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
    return this.bikeService.updateImages(id, { images: files });
  }

  @Authorization(UserRole.ADMIN)
  @Patch(':id/location')
  async updateLocation(
    @Param('id') id: string,
    @Body('locationId') locationId: string,
  ) {
    return this.bikeService.updateLocation(id, locationId);
  }

  @Authorization(UserRole.ADMIN)
  @Patch(':id/availability')
  async updateAvailability(
    @Param('id') id: string,
    @Body() dto: UpdateBikeAvailabilityDto,
  ) {
    return this.bikeService.updateAvailability(id, dto);
  }

  @Authorization()
  @Delete(':id')
  async delete(@Param('id') id: string, @Authorized() user: User) {
    return this.bikeService.delete(id, user.id, user.role);
  }
}
