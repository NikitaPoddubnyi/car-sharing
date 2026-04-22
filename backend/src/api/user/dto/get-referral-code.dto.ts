import { IsEmail, IsPhoneNumber, IsNotEmpty } from 'class-validator';

export class GetReferralCodeDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  phone: string;
}
