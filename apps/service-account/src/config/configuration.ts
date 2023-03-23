import applicationConfig from './application';
import awsConfig from './aws';
import databaseConfig from './database';
import securityConfig from './security';

const configuration = {
  port: process.env.PORT || 4002,
  application: applicationConfig(),
  security: securityConfig(),
  aws: awsConfig(),
  database: { ...databaseConfig() },
};

type Configuration = typeof configuration;

export default (): Configuration => ({
  ...configuration,
});
