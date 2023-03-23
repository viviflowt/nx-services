import { registerAs } from '@nestjs/config';

export interface SecurityConfiguration {
  secret: string;
  jwt: {
    secret: string;
    expiresIn: string;
    expiresInRefresh: string;
    issuer: string;
  };
}

export default registerAs(
  'security',
  (): SecurityConfiguration => ({
    secret: process.env.SECRET || 'secret',
    jwt: {
      secret: process.env.JWT_SECRET || 'secret',
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
      expiresInRefresh: process.env.JWT_REFRESH_EXPIRATION || '7d',
      issuer: 'org.access',
    },
  })
);
