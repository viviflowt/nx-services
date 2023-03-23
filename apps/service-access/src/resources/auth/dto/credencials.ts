import { ApiProperty } from '@nestjs/swagger';
import { Account } from '../../../entities/account.entity';
import { Expose } from 'class-transformer';

import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class Credencials {
  constructor(partial?: Partial<Credencials>) {
    Object.assign(this, partial);
  }

  @Expose()
  account: Partial<Account>;
}
