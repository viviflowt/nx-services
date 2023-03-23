import { registerAs } from '@nestjs/config';

export interface RedisConfiguration {
  host: string;
  port: number;
  username: string;
  password: string;
  db: number;
}

export default registerAs(
  'redis',
  (): RedisConfiguration => ({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10),
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB, 10),
  })
);
