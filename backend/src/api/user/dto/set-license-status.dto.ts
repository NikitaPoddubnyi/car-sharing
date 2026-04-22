import { DriverLicenseStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class SetLicenseStatusDto {
  @IsEnum(DriverLicenseStatus)
  @IsString()
  @IsNotEmpty()
  status: DriverLicenseStatus;
}
