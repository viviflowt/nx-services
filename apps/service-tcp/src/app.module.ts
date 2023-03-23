import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthModule, JwtAuthGuardProvider } from '@org/auth';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import helmet from 'helmet';
import responseTime from 'response-time';

import configuration from './config/configuration';
import { AccountController } from './controllers/account.controller';
import { RpcAccountController } from './controllers/rpc-account.controller';
import { DatabaseModule } from './database/database.module';
import { AccountService } from './services/account.service';
import { RpcAccountService } from './services/rpc-account.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import ms from 'ms';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    EventEmitterModule.forRoot({
      newListener: true,
      removeListener: true,
      wildcard: true,
      delimiter: '.',
      verboseMemoryLeak: true,
      ignoreErrors: false,
      global: true,
    }),
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: 'ACCOUNT_SERVICE2',
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: 'localhost',
            port: 8877,
            retryAttempts: 5,
            retryDelay: ms('5s'),
            commandTimeout: ms('60s'),
            connectionName: 'authorization',
          },
        }),
        inject: [ConfigService],
      },
    ]),
    DatabaseModule,
    AuthModule,
  ],
  controllers: [AccountController, RpcAccountController],
  providers: [JwtAuthGuardProvider(), AccountService, RpcAccountService],
  exports: [],
})
export class AppModule implements NestModule {
  constructor(private readonly configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        helmet(),
        compression(),
        cookieParser(this.configService.get('SECRET', 'secret')),
        session({
          secret: this.configService.get('SECRET', 'secret'),
          resave: false,
          saveUninitialized: false,
        }),
        responseTime()
      )
      .forRoutes('*');
  }
}
