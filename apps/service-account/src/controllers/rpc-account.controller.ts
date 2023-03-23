import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { RpcAccountService } from '../services/rpc-account.service';

@Controller()
export class RpcAccountController {
  constructor(private readonly rpcAccountService: RpcAccountService) {}

  @MessagePattern('get_account_by_id')
  async getAccountById(id: string) {
    return this.rpcAccountService.getAccountByIdOrThrow(id);
  }

  @MessagePattern('get_account_by_email')
  async getAccountByEmail(email: string) {
    return this.rpcAccountService.getAccountByEmailOrThrow(email);
  }
}
