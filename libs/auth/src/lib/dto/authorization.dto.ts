import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AuthorizationDto {
  @ApiProperty()
  @Expose()
  authorization: string;
}
