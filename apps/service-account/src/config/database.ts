import path from 'path';
import { DataSourceOptions } from 'typeorm';

import { registerAs } from '@nestjs/config';
import ms from 'ms';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const PostgresConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.PRIMARY_DB_HOST,
  port: +process.env.PRIMARY_DB_PORT,
  username: process.env.PRIMARY_DB_USERNAME,
  password: process.env.PRIMARY_DB_PASSWORD,
  database: process.env.PRIMARY_DB_DATABASE,
  entities: [
    path.join(__dirname, '../entities/**/*.entity{.ts,.js}'),
    path.join(__dirname, '../entities/**/*.view-entity{.ts,.js}'),
  ],
  logging: ['error', 'warn'],
  logger: 'advanced-console',
  // entitySkipConstructor: true,
  synchronize: true,
  dropSchema: false,
  migrationsTableName: 'typeorm_migrations',
  namingStrategy: new SnakeNamingStrategy(),
  migrations: [path.join(__dirname, '../database/migrations/*{.ts,.js}')],
  subscribers: [path.join(__dirname, '../database/subscribers/*{.ts,.js}')],
  maxQueryExecutionTime: ms('1m'),
};

interface DatabaseConfiguration {
  [name: string]: DataSourceOptions;
}

export default registerAs(
  'database',
  (): DatabaseConfiguration => ({
    primary: PostgresConfig,
  })
);
