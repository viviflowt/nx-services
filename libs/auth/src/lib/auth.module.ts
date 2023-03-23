import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { ClientsModule, Transport } from '@nestjs/microservices';
import ms from 'ms';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('security.jwt.secret'),
        ignoreExpiration: false,
        signOptions: {
          expiresIn: configService.get('security.jwt.expiresIn'),
          issuer: configService.get('security.jwt.issuer'),
          encoding: 'utf8',
        },
      }),
      inject: [ConfigService],
    }),
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: 'ACCOUNT_SERVICE',
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.REDIS,
          options: {
            host: configService.get('redis.host'),
            port: configService.get('redis.port'),
            db: configService.get('redis.db'),
            retryAttempts: 5,
            retryDelay: ms('5s'),
            commandTimeout: ms('60s'),
            connectionName: 'authorization',
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtStrategy],
})
export class AuthModule {}
