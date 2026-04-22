import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateCarAvailabilityDto {
  @IsNotEmpty()
  @IsBoolean()
  isAvailable: boolean;
}
