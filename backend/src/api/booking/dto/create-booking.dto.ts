import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsOptional()
  bikeId?: string;

  @IsString()
  @IsOptional()
  carId?: string;

  @IsString()
  @IsNotEmpty()
  pickupLocationId: string;

  @IsString()
  @IsOptional()
  dropOffLocationId: string;

  @IsDateString()
  startDateDay: string;

  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Time must be in format HH:mm',
  })
  startDateTime: string;

  @IsDateString()
  endDateDay: string;

  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Time must be in format HH:mm',
  })
  endDateTime: string;
}
