import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AccountRepository } from '../../repositories/account.repository';
import { Credencials } from './dto/credencials';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly accountRepository: AccountRepository
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const account = await this.accountRepository.findByEmail(email);

    if (!account) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!account.comparePassword(password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: account.id };

    const authorization = this.jwtService.sign(payload);

    return { authorization };
  }

  async getCredencials(payload: any): Promise<Credencials> {
    const { sub } = payload;
    const account = await this.accountRepository.findById(sub);
    return new Credencials({ account });
  }

  async getProfile() {
    return {
      profile: 'profile',
    };
  }
}
