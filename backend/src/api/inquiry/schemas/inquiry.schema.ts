import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { InquiryStatus } from '../enum/status.enum';
import { IInquiry } from '../interfaces/inquiry.interface';

@Schema({
  timestamps: true,
  collection: 'inquiries',
  versionKey: false,
})
export class Inquiry implements IInquiry  {
  @Prop({
    required: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
  })
  email: string;

  @Prop({ required: true, minlength: 10 })
  message: string;

  @Prop({
    type: String,
    enum: InquiryStatus,
    default: InquiryStatus.PENDING,
  })
  status: InquiryStatus;
}

export const InquirySchema = SchemaFactory.createForClass(Inquiry);