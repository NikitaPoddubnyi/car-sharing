import { Module } from '@nestjs/common';
import { CloudinaryModule } from 'src/infra/claudinary/claudinary.module';
import { PrismaModule } from 'src/infra/prisma/prisma.module';
import { CarService } from './car.service';
import { CarController } from './car.controller';

@Module({
  imports: [PrismaModule, CloudinaryModule],
  controllers: [CarController],
  providers: [CarService],
})
export class CarModule {}
