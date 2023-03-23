import applicationConfig from './application';
import awsConfig from './aws';
import databaseConfig from './database';
import redisConfig from './redis';
import securityConfig from './security';

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
