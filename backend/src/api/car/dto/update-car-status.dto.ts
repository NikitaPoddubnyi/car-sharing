import { IsEnum, IsString } from 'class-validator';
import { VehicleStatus } from '@prisma/client';

export class UpdateCarStatusDto {
  @IsEnum(VehicleStatus, {
    message: 'Status must be one of: PENDING, APPROVED, REJECTED',
  })
  status: VehicleStatus;
}
