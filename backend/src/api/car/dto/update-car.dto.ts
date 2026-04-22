import { PartialType } from '@nestjs/mapped-types';
import { CreateCarDto } from './create-car.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { VehicleStatus } from '@prisma/client';

export class UpdateCarDto extends PartialType(CreateCarDto) {
  @IsOptional()
  @IsString()
  locationId?: string;

  @IsOptional()
  @IsString()
  newOwnerId?: string;

  @IsOptional()
  @IsEnum(VehicleStatus)
  @IsString()
  status?: VehicleStatus;
}
