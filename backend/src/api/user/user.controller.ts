import { UserService } from './user.service';
import { Authorization, Public } from 'src/common/decorators';
import { Authorized } from 'src/common/decorators';
import { UserRole, type User } from '@prisma/client';
import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import {
  UpdateLicenseDto,
  CompleteProfileDto,
  GetReferralCodeDto,
  SetLicenseStatusDto,
} from './dto';
import type { Response } from 'express';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  @Authorization()
  async getProfile(@Authorized('id') userId: string) {
    return await this.userService.findById(userId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Authorization(UserRole.ADMIN)
  async getUserById(@Param('id') id: string) {
    return await this.userService.findById(id);
  }

  @Public()
  @Post('check-user')
  async getReferralCode(@Body() dto: GetReferralCodeDto) {
    const result = await this.userService.getReferralCode(dto);
    return result;
  }

  @Get('users')
  @Authorization(UserRole.ADMIN)
  async getUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return await this.userService.findAll(page, limit);
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
    return await this.userService.updateAvatar(userId, file);
  }

  @Patch('profile/license')
  @Authorization()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'front', maxCount: 1 },
      { name: 'back', maxCount: 1 },
    ]),
  )
  async completeLicense(
    @Authorized('id') userId: string,
    @Body() dto: UpdateLicenseDto,
    @UploadedFiles()
    files: { front?: Express.Multer.File[]; back?: Express.Multer.File[] },
  ) {
    await this.userService.updateLicense(userId, dto);

    return await this.userService.updateLicenseImages(userId, files);
  }

  @Patch('profile/complete')
  @Authorization()
  async updateProfile(
    @Authorized('id') userId: string,
    @Body() dto: CompleteProfileDto,
  ) {
    return await this.userService.updateProfile(userId, dto);
  }

  @Delete('profile')
  @Authorization()
  async deleteProfile(
    @Res({ passthrough: true }) res: Response,
    @Authorized('id') userId: string,
  ) {
    return await this.userService.deleteProfile(res, userId);
  }

  @Delete(':id')
  @Authorization(UserRole.ADMIN)
  async deleteUser(@Authorized('id') userId: string) {
    return await this.userService.deleteUser(userId);
  }

  @Patch(':id/license/status')
  @Authorization(UserRole.ADMIN)
  async changeLicenseStatus(
    @Param('id') userId: string,
    @Body() dto: SetLicenseStatusDto,
  ) {
    return await this.userService.changeLicenseStatus(userId, dto);
  }
}
