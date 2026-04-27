import { Module } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CloudinaryModule } from 'src/infra/claudinary/claudinary.module';
import { AuthModule } from '../auth/auth.module';
import { PurgeUserService } from './services/purge-user.service';

@Module({
  imports: [CloudinaryModule, AuthModule],
  controllers: [UserController],
  providers: [UserService, PrismaService, PurgeUserService],
})
export class UserModule {}
