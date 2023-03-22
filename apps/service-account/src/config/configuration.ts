import awsConfig from './aws';
import databaseConfig from './database';

const configuration = {
  aws: awsConfig(),
  database: { ...databaseConfig() },
};

type Configuration = typeof configuration;

export default (): Configuration => ({
  ...configuration,
});
