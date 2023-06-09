import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Nullable } from '@org/common';
import { BaseRepository } from '@org/repository';
import { DataSource } from 'typeorm';
import { Account } from '../entities/account.entity';

@Injectable()
export class AccountRepository extends BaseRepository<Account> {
  constructor(
    @InjectDataSource('primary')
    dataSource: DataSource
  ) {
    super(dataSource, Account);
  }

  async findById(id: string): Promise<Nullable<Account>> {
    return this.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<Nullable<Account>> {
    return this.findOne({ where: { email } });
  }
}
