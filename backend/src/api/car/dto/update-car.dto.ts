import { PartialType } from '@nestjs/mapped-types';
import { CreateCarDto } from './create-car.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCarDto extends PartialType(CreateCarDto) {
    @IsOptional()
    @IsString()
    locationId?: string;
}
