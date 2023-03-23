import dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import configuration from './configuration';
dotenv.config();

const instance = new DataSource({
  ...configuration().database.primary,
  logging: true,
  logger: 'advanced-console',
});

export default instance;
