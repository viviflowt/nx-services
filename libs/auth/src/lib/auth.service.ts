import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Credencials } from './dto/credencials';
import { LoginDto } from './dto/login.dto';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('ACCOUNT_SERVICE')
    private readonly client: ClientProxy
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const source = this.client.send('get_account_by_email', email);
    const account = await lastValueFrom(source);

    if (!account) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = bcrypt.compareSync(password, account.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: account.id };

    const authorization = this.jwtService.sign(payload);

    return { authorization };
  }

  async getCredencials(payload: any): Promise<Credencials> {
    const { sub } = payload;

    const source = this.client.send('get_account_by_id', sub);
    const account = await lastValueFrom(source);

    return new Credencials({ account });
  }
}
