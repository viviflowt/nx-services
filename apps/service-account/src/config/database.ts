import path from 'path';
import { DataSourceOptions } from 'typeorm';

import { registerAs } from '@nestjs/config';
import ms from 'ms';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const replication = (count: number) => {
  const port = process.env.PRIMARY_DB_REPLICA_PORT;

  return {
    replication: {
      master: {
        host: process.env.PRIMARY_DB_HOST,
        port: +process.env.PRIMARY_DB_PORT,
        username: process.env.PRIMARY_DB_USERNAME,
        password: process.env.PRIMARY_DB_PASSWORD,
        database: process.env.PRIMARY_DB_DATABASE,
      },
      slaves: [
        ...Array.from({ length: count }).map((_, index) => ({
          host: process.env.PRIMARY_DB_HOST,
          port: 5451 + index,
          username: process.env.PRIMARY_DB_USERNAME,
          password: process.env.PRIMARY_DB_PASSWORD,
          database: process.env.PRIMARY_DB_DATABASE,
        })),
      ],
    },
  };
};

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
  namingStrategy: new SnakeNamingStrategy(),
  migrations: [path.join(__dirname, '../database/migrations/*{.ts,.js}')],
  subscribers: [path.join(__dirname, '../database/subscribers/*{.ts,.js}')],
  migrationsTableName: 'typeorm_migrations',
  metadataTableName: 'typeorm_metadata',
  uuidExtension: 'uuid-ossp',
  installExtensions: true,
  maxQueryExecutionTime: ms('1m'),
  replication: {
    master: {
      host: process.env.PRIMARY_DB_HOST,
      port: +process.env.PRIMARY_DB_PORT,
      username: process.env.PRIMARY_DB_USERNAME,
      password: process.env.PRIMARY_DB_PASSWORD,
      database: process.env.PRIMARY_DB_DATABASE,
    },
    slaves: [
      ...Array.from({ length: 2 }).map((_, index) => ({
        host: process.env.PRIMARY_DB_HOST,
        port: +process.env.PRIMARY_DB_PORT + index,
        username: process.env.PRIMARY_DB_USERNAME,
        password: process.env.PRIMARY_DB_PASSWORD,
        database: process.env.PRIMARY_DB_DATABASE,
      })),
    ],
  },
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
