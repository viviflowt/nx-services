import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';

import configuration from './config/configuration';
import { DatabaseModule } from "./database";

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
  ],
  providers: [],
  exports: [],
})
export class AppModule {}
