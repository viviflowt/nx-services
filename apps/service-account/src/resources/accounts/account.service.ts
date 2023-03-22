import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaginatedQueryOptions, PaginatedResult } from '@org/repository';
import { FindOneOptions, Not } from 'typeorm';
import { Account, AccountStatus } from '../../entities';
import { AccountRepository } from '../../repositories/account.repository';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountService {
  constructor(private readonly accountRepository: AccountRepository) {}

  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    const { email } = createAccountDto;

    if (await this.accountRepository.findByEmail(email)) {
      throw new ConflictException('Email already associated with an account');
    }

    return this.accountRepository.transaction(async (transactionManager) => {
      const account = this.accountRepository.create(createAccountDto);
      return transactionManager.save(account);
    });
  }

  async findAll(
    query: PaginatedQueryOptions<Account>
  ): Promise<PaginatedResult<Account>> {
    return this.accountRepository.paginate(query);
  }

  async findOneOrThrow(options: FindOneOptions<Account>): Promise<Account> {
    const account = await this.accountRepository.findOne(options);

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return account;
  }

  async findOne(id: string) {
    return this.findOneOrThrow({ where: { id } });
  }

  async update(
    id: string,
    updateAccountDto: UpdateAccountDto
  ): Promise<Account> {
    const account = await this.findOneOrThrow({ where: { id } });

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

    return await this.accountRepository.transaction(
      async (transactionManager) => {
        return transactionManager.save(mergedAccount);
      }
    );
  }

  async activate(id: string): Promise<void> {
    const account = await this.findOneOrThrow({ where: { id } });

    await this.accountRepository.transaction(async (transactionManager) => {
      const updatedAccount = this.accountRepository.merge(account, {
        status: AccountStatus.Active,
      });

      return transactionManager.save(updatedAccount);
    });
  }

  async deactivate(id: string): Promise<void> {
    const account = await this.findOneOrThrow({ where: { id } });

    await this.accountRepository.transaction(async (transactionManager) => {
      const updatedAccount = this.accountRepository.merge(account, {
        status: AccountStatus.Inactive,
      });

      return transactionManager.save(updatedAccount);
    });
  }

  async remove(id: string): Promise<void> {
    const account = await this.findOneOrThrow({ where: { id } });

    await this.accountRepository.transaction(async (transactionManager) => {
      return transactionManager.softRemove(account);
    });
  }
}
