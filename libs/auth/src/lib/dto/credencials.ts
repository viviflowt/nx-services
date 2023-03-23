import { Expose } from 'class-transformer';

export class CredencialAccount {
  @Expose()
  id: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;
}

export class Credencials {
  constructor(partial?: Partial<Credencials>) {
    Object.assign(this, partial);
  }

  @Expose()
  account: Partial<CredencialAccount>;
}
