import { Module } from '@nestjs/common';
import { CloudinaryService } from 'src/infra/claudinary/claudinary.service';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CloudinaryModule } from 'src/infra/claudinary/claudinary.module';

@Module({
  imports: [CloudinaryModule],
  controllers: [UserController],
  providers: [UserService, PrismaService, CloudinaryService],
})
export class UserModule {}
