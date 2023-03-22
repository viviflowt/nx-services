import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { PaginatedQueryOptions } from '@org/base-repository';
import { Account } from '../../database';
import { AccountRepository } from '../../repositories/account.repository';
import { Not } from 'typeorm';

@Injectable()
export class AccountService {
  constructor(private readonly accountRepository: AccountRepository) {}

  async create(createAccountDto: CreateAccountDto) {
    const { email } = createAccountDto;

    if (await this.accountRepository.findByEmail(email)) {
      throw new ConflictException('Email already associated with an account');
    }

    const account = this.accountRepository.transaction(
      async (transactionManager) => {
        const account = this.accountRepository.create(createAccountDto);
        return transactionManager.save(account);
      }
    );

    return account;
  }

  async findAll(query: PaginatedQueryOptions<Account>) {
    const result = await this.accountRepository.paginate(query);

    return result;
  }

  async findOne(id: string) {
    const account = await this.accountRepository.findById(id);

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return account;
  }

  async update(id: string, updateAccountDto: UpdateAccountDto) {
    const account = await this.accountRepository.findById(id);

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    const mergedAccount = this.accountRepository.merge(
      account,
      updateAccountDto
    );

    if (
      await this.accountRepository.findOne({
        where: {
          email: mergedAccount.email,
          id: Not(mergedAccount.id),
        },
      })
    ) {
      throw new ConflictException('Email already associated with an account');
    }

    const updatedAccount = await this.accountRepository.transaction(
      async (transactionManager) => {
        return transactionManager.save(mergedAccount);
      }
    );

    return updatedAccount;
  }

  async remove(id: string) {
    const account = await this.accountRepository.findById(id);

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    await this.accountRepository.transaction(async (transactionManager) => {
      return transactionManager.softRemove(account);
    });
  }
}
