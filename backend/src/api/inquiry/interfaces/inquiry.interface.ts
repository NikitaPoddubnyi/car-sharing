import { InquiryStatus } from '../enum/status.enum';

export interface IInquiry {
  id?: string;
  email: string;
  message: string;
  status: InquiryStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
