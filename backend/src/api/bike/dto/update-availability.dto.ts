import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateBikeAvailabilityDto {
  @IsNotEmpty()
  @IsBoolean()
  isAvailable: boolean;
}
