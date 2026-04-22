import { IsEnum, IsString } from 'class-validator';
import { InquiryStatus } from '../enum/status.enum';

export class UpdateInquiryStatusDto {
  @IsEnum(InquiryStatus, {
    message: 'Status must be one of: CONFIRMED, PENDING, CLOSED',
  })
  @IsString()
  status: InquiryStatus;
}
