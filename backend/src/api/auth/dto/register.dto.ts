import { ApiOperation, ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class RegisterRequest {
  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Иван',
    type: String,
    required: true,
    minLength: 3,
    maxLength: 50,
  })
  @IsString({ message: 'Имя должно быть строкой' })
  @IsNotEmpty({ message: 'Имя не должно быть пустым' })
  @MinLength(3, { message: 'Имя не должно быть короче 3 символов' })
  @MaxLength(50, { message: 'Имя не должно превышать 50 символов' })
  firstName: string;

  @ApiProperty({
	description: 'Фамилия пользователя',
	example: 'Иванов',
	type: String,
	required: true,
	minLength: 3,
	maxLength: 50,
  })
  @IsString({ message: 'Фамилия должна быть строкой' })
  @IsNotEmpty({ message: 'Фамилия не должна быть пустой' })
  @MinLength(3, { message: 'Фамилия не должна быть короче 3 символов' })
  @MaxLength(50, { message: 'Фамилия не должна превышать 50 символов' })
  lastName: string;

  @ApiProperty({
    description: 'Email пользователя',
    example: 'hM0aR@example.com',
    type: String,
    required: true,
  })
  @IsEmail()
  @IsNotEmpty({ message: 'Email не должен быть пустым' })
  email: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    example: 'rdgttsdv23',
    type: String,
    required: true,
    minLength: 6,
    maxLength: 128,
  })
  @IsString({ message: 'Пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Пароль не должен быть пустым' })
  @MinLength(6, { message: 'Пароль не должен быть короче 6 символов' })
  @MaxLength(128, { message: 'Пароль не должен превышать 50 символов' })
  password: string;
}
