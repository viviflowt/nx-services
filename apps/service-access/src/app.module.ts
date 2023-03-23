import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';

import configuration from './config/configuration';
import { DatabaseModule } from './database/database.module';
import { AccountModule } from './resources/accounts/account.module';

import compression from 'compression';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import helmet from 'helmet';
import responseTime from 'response-time';
import { AuthModule } from './resources/auth/auth.module';

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
    DatabaseModule,
    AccountModule,
    AuthModule,
  ],
  providers: [],
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
