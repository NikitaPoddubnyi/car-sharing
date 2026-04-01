import { UserService } from './user.service';
import { Authorization } from 'src/common/decorators';
import { Authorized } from 'src/common/decorators';
import { UserRole, type User } from '@prisma/client';
import {
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @Authorization()
  getProfile(@Authorized() user: User) {
    return user;
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
}
