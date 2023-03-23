import { registerAs } from '@nestjs/config';

export interface ApplicationConfiguration {
  name: string;
  description?: string;
  version?: string;
  stage: string;
}

export default registerAs(
  'application',
  (): ApplicationConfiguration => ({
    name: 'service-account',
    description: 'Account management for the application.',
    version: process.env.npm_package_version || process.env.APP_VERSION,
    stage: process.env.NODE_ENV || 'development',
  })
);
