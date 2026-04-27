import { Type } from 'class-transformer';
import { IsOptional, IsString, IsDate } from 'class-validator';

export class SearchCarsDto {
  @IsOptional()
  @IsString()
  locationId?: string;

  @IsOptional()
  @Type(() => Date) 
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;
}