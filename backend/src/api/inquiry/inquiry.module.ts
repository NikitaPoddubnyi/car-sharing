import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InquiryController } from './inquiry.controller';
import { InquiryService } from './inquiry.service';
import { Inquiry, InquirySchema } from './schemas/inquiry.schema';

@Module({
   imports: [
    MongooseModule.forFeature([
      {
        name: Inquiry.name,
        schema: InquirySchema,
      },
    ])
  ],
  controllers: [InquiryController],
  providers: [InquiryService],
})
export class InquiryModule {}
