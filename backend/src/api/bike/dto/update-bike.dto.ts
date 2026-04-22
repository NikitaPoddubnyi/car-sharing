import { PartialType } from '@nestjs/mapped-types';
import { CreateBikeDto } from './create-bike.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { VehicleStatus } from '@prisma/client';

export class UpdateBikeDto extends PartialType(CreateBikeDto) {
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
