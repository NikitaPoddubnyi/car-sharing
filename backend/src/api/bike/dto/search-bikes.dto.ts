import { IsOptional, IsString, IsInt, IsEnum, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { FuelType, GearBox, TyreType } from '@prisma/client';

export class SearchBikesDto {
  @IsOptional() @IsString() locationId?: string;
  @IsOptional() @IsString() startDate?: string;
  @IsOptional() @IsString() endDate?: string;
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsEnum(FuelType) fuelType?: FuelType;
  @IsOptional() @IsEnum(GearBox) gearBox?: GearBox;
  @IsOptional() @IsEnum(TyreType) tyreType?: TyreType;
  @IsOptional() @IsString() brand?: string;
  @IsOptional() @Type(() => Number) @Min(0) minPrice?: number;
  @IsOptional() @Type(() => Number) @Min(0) maxPrice?: number;
  @IsOptional() @IsString() priceSort?: 'asc' | 'desc';
  @IsOptional() @IsString() timeDuration?: 'hour' | 'day';

  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) limit: number;
}
