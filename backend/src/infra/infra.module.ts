import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { CloudinaryModule } from './claudinary/claudinary.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { getMongodbConfig } from 'src/config/mongodb.config';

@Module({
  imports: [
    PrismaModule,
    CloudinaryModule,
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getMongodbConfig,
    }),
  ],
})
export class InfraModule {}
