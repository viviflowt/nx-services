import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Account } from '../entities/account.entity';
import { AccountRepository } from '../repositories/account.repository';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      name: 'primary',
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database.primary'),
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),

    TypeOrmModule.forFeature([Account], 'primary'),
  ],
  providers: [AccountRepository],
  exports: [AccountRepository],
})
export class DatabaseModule {}
