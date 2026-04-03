import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateLicenseDto {
  @IsString()
  @IsNotEmpty()
  @Length(5, 20, {
    message: 'The license number must be between 5 and 20 characters',
  })
  licenseNumber: string;

  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'Incorrect format date of issue' })
  @IsNotEmpty()
  issueDate: Date;

  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'Incorrect format date of expiry' })
  @IsNotEmpty()
  expiryDate: Date;

  @IsString()
  @Length(2, 50)
  @IsOptional()
  country?: string;
}
