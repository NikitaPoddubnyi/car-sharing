import { IsDate, IsNotEmpty, IsString, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class CompleteProfileDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Input valid phone number' })
  phone: string;

  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'Input valid date' })
  @IsNotEmpty()
  birthDate: Date;
}
