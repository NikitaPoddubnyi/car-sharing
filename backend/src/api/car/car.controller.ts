import { Body, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, Patch, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { CarService } from './car.service';
import { Authorization } from 'src/common/decorators';
import { UserRole } from '@prisma/client';
import { CreateCarDto } from './dto/create-car.dto';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UpdateCarDto } from './dto';

@Controller('cars')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Get()
  async findAll() {
    return await this.carService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.carService.findOne(id);
  }

  @Authorization(UserRole.ADMIN)
  @Post()
  @UseInterceptors(FilesInterceptor('images', 10))
  async create(@Body() dto: CreateCarDto,
   @UploadedFiles(
          new ParseFilePipe({
          validators: [
            new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }),
            new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp)' }),
          ],
        })) 
        files: Express.Multer.File[]) {
    return await this.carService.create(dto, { images: files });
  }

   @Authorization(UserRole.ADMIN)
   @Patch(':id')
    @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 10 }]))
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateCarDto,
        @UploadedFiles() files: { images?: Express.Multer.File[] }
    ) {
        return this.carService.update(id, dto, { images: files.images });
    }

    @Authorization(UserRole.ADMIN)
    @Patch(':id/images')
    @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 10 }]))
    async updateImages(
        @Param('id') id: string,
        @UploadedFiles( new ParseFilePipe({
            validators: [
                new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }),
                new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp)' }),
            ],
        })
    ) files: { images: Express.Multer.File[] }
    ) {
        return this.carService.updateImages(id, { images: files.images });
    }

    @Authorization(UserRole.ADMIN)
    @Patch(':id/location')
    async updateLocation(
        @Param('id') id: string,
        @Body('locationId') locationId: string
    ) {
        return this.carService.updateLocation(id, locationId);
    }

    @Authorization(UserRole.ADMIN)
    @Patch(':id/availability')
    async updateAvailability(
        @Param('id') id: string,
        @Body('isAvailable') isAvailable: boolean
    ) {
        return this.carService.updateAvailability(id, isAvailable);
    }

    @Authorization(UserRole.ADMIN)
    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.carService.delete(id);
    }
}
