import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import { Account } from '../entities/account.entity';
import { AccountRepository } from '../repositories/account.repository';
import { PaginatedQueryOptions } from '@org/repository';

@Injectable()
export class RpcAccountService {
  constructor(private readonly accountRepository: AccountRepository) {}

  async getAccountByIdOrThrow(email: string): Promise<Account> {
    const account = await this.accountRepository.findById(email);

    if (!account) {
      throw new RpcException('Account not found');
    }

    return account;
  }

  async getAccountByEmailOrThrow(email: string): Promise<Account> {
    const account = await this.accountRepository.findByEmail(email);

    if (!account) {
      throw new RpcException('Account not found');
    }

    return account;
  }

  async listAccounts(query: PaginatedQueryOptions<Account>) {
    return this.accountRepository.paginate(query);
  }
}
