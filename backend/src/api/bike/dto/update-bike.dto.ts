import { PartialType } from '@nestjs/mapped-types';
import { CreateBikeDto } from './create-bike.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateBikeDto extends PartialType(CreateBikeDto) {
	@IsOptional()
	@IsString()
	locationId?: string;
}
