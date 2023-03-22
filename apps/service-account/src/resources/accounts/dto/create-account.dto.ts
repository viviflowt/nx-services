import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsEqualTo } from '@org/common';
import { faker } from '@faker-js/faker';

import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEmail,
  MinLength,
} from 'class-validator';

export class CreateAccountDto {
  @ApiPropertyOptional({ example: faker.name.firstName() })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({ example: faker.name.lastName() })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ example: faker.internet.email().toLowerCase() })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'password' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @IsEqualTo('password')
  confirmPassword: string;
}
