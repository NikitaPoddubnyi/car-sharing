import { UserService } from './user.service';
import { Authorization } from 'src/common/decorators';
import { Authorized } from 'src/common/decorators';
import { UserRole, type User } from '@prisma/client';
import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateLicenseDto, CompleteProfileDto } from './dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @Authorization()
  async getProfile(@Authorized('id') userId: string) {
    return await this.userService.findById(Number(userId));
  }

  @Get('users')
  @Authorization(UserRole.ADMIN)
  async getUsers() {
    return await this.userService.findAll();
  }

  @Post('profile/avatar')
  @Authorization()
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @Authorized('id') userId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.userService.updateAvatar(Number(userId), file);
  }

  @Patch('profile/license')
  @Authorization()
  async updateLicense(
    @Authorized('id') userId: string,
    @Body() dto: UpdateLicenseDto,
  ) {
    return this.userService.updateLicense(Number(userId), dto);
  }

  @Patch('profile/complete')
  @Authorization()
  async updateProfile(
    @Authorized('id') userId: string,
    @Body() dto: CompleteProfileDto,
  ) {
    return this.userService.updateProfile(Number(userId), dto);
  }
}
