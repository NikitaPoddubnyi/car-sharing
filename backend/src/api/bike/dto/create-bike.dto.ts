import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
  IsOptional,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { FuelType, GearBox, TyreType } from '@prisma/client';

export class CreateBikeDto {
  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  year: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  groundClearance: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  engineDisplacement: number;

  @IsString()
  @IsNotEmpty()
  emmisionType: string;

  @IsEnum(FuelType)
  @IsNotEmpty()
  fuelType: FuelType;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  mileage: number;

  @IsString()
  @IsNotEmpty()
  abs: string;

  @IsEnum(GearBox)
  @IsNotEmpty()
  gearBox: GearBox;

  @IsEnum(TyreType)
  @IsNotEmpty()
  tyreType: TyreType;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  engineSize: number;

  @Type(() => Number)
  @IsNotEmpty()
  pricePerDay: number;

  @Type(() => Number)
  @IsNotEmpty()
  pricePerHour: number;

  @IsString()
  @IsNotEmpty()
  locationId: string;

  @IsString()
  @IsOptional()
  @MinLength(10, { message: 'Description should be at least 10 characters' })
  @MaxLength(1000, { message: 'Description should not exceed 1000 characters' })
  description?: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isAvailable?: boolean;
}
