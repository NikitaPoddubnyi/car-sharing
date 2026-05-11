import { IsOptional, IsString, IsInt, IsEnum, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { BodyType, Transmission, DriveTrain, FuelType } from '@prisma/client';

export class SearchCarsDto {
  @IsOptional() @IsString() locationId?: string;
  @IsOptional() @IsString() startDate?: string;
  @IsOptional() @IsString() endDate?: string;
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsEnum(BodyType) bodyType?: BodyType;
  @IsOptional() @IsEnum(Transmission) transmission?: Transmission;
  @IsOptional() @IsEnum(DriveTrain) driveTrain?: DriveTrain;
  @IsOptional() @IsEnum(FuelType) fuelType?: FuelType;
  @IsOptional() @IsString() brand?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) seats?: number;
  @IsOptional() @Type(() => Number) @Min(0) minPrice?: number;
  @IsOptional() @Type(() => Number) @Min(0) maxPrice?: number;
  @IsOptional() @IsString() priceSort?: 'asc' | 'desc';
  @IsOptional() @IsString() timeDuration?: 'hour' | 'day';
  
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) limit: number;
}