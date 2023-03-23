import { Expose } from 'class-transformer';
import { Account } from '../../../entities/account.entity';

export class Credencials {
  constructor(partial?: Partial<Credencials>) {
    Object.assign(this, partial);
  }

  @Expose()
  account: Partial<Account>;
}
