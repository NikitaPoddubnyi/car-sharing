import { Body, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, Patch, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { BikeService } from './bike.service';
import { UserRole } from '@prisma/client';
import { Authorization } from 'src/common/decorators';
import { FileFieldsInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CreateBikeDto, UpdateBikeDto } from './dto';

@Controller('bikes')
export class BikeController {
  constructor(private readonly bikeService: BikeService) {}

 @Get()
  async findAll() {
    return await this.bikeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.bikeService.findOne(id);
  }

  @Authorization(UserRole.ADMIN)
  @Post()
  @UseInterceptors(FilesInterceptor('images', 10))
  async create(@Body() dto: CreateBikeDto,
   @UploadedFiles(
          new ParseFilePipe({
          validators: [
            new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }),
            new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp)' }),
          ],
        })) 
        files: Express.Multer.File[]) {
    return await this.bikeService.create(dto, { images: files });
  }

   @Authorization(UserRole.ADMIN)
   @Patch(':id')
    @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 10 }]))
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateBikeDto,
        @UploadedFiles() files: { images?: Express.Multer.File[] }
    ) {
        return this.bikeService.update(id, dto, { images: files.images });
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
        return this.bikeService.updateImages(id, { images: files.images });
    }

    @Authorization(UserRole.ADMIN)
    @Patch(':id/location')
    async updateLocation(
        @Param('id') id: string,
        @Body('locationId') locationId: string
    ) {
        return this.bikeService.updateLocation(id, locationId);
    }

    @Authorization(UserRole.ADMIN)
    @Patch(':id/availability')
    async updateAvailability(
        @Param('id') id: string,
        @Body('isAvailable') isAvailable: boolean
    ) {
        return this.bikeService.updateAvailability(id, isAvailable);
    }

    @Authorization(UserRole.ADMIN)
    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.bikeService.delete(id);
    }
}
