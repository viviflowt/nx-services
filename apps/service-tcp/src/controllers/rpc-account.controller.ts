import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { RpcAccountService } from '../services/rpc-account.service';
import { PaginatedQueryOptions } from '@org/repository';
import { Account } from '../entities/account.entity';
import { Public } from '@org/auth';

@Controller()
export class RpcAccountController {
  constructor(private readonly rpcAccountService: RpcAccountService) {}

  @MessagePattern('get_account_by_id')
  @Public()
  async getAccountById(id: string) {
    return this.rpcAccountService.getAccountByIdOrThrow(id);
  }

  @MessagePattern('get_account_by_email')
  async getAccountByEmail(email: string) {
    return this.rpcAccountService.getAccountByEmailOrThrow(email);
  }

  @MessagePattern('list_accounts')
  @Public()
  async listAccounts(query: PaginatedQueryOptions<Account>) {
    const accounts = await this.rpcAccountService.listAccounts(query);
    return accounts;
  }
}
