import applicationConfig from './application';
import awsConfig from './aws';
import databaseConfig from './database';
import securityConfig from './security';
import redisConfig from './redis';

const configuration = {
  port: process.env.PORT || 4001,
  application: applicationConfig(),
  security: securityConfig(),
  aws: awsConfig(),
  redis: redisConfig(),
  database: { ...databaseConfig() },
};

type Configuration = typeof configuration;

export default (): Configuration => ({
  ...configuration,
});
