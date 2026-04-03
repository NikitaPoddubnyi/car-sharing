import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateInquiryDto {
  @IsEmail({}, { message: 'Uncorrect email' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10, { message: 'Message should be at least 10 characters' })
  message: string;
}
