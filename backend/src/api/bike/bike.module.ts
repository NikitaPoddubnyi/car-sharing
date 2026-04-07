import { Module } from '@nestjs/common';
import { BikeService } from './bike.service';
import { BikeController } from './bike.controller';
import { PrismaModule } from 'src/infra/prisma/prisma.module';
import { CloudinaryModule } from 'src/infra/claudinary/claudinary.module';

@Module({
  imports: [PrismaModule, CloudinaryModule],
  controllers: [BikeController],
  providers: [BikeService],
})
export class BikeModule {}
