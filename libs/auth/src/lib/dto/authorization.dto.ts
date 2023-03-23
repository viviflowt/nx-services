import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AuthorizationDto {
  @ApiProperty()
  @Expose()
  authorization: string;
}
