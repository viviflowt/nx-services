/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import {
  ClassSerializerInterceptor,
  HttpStatus,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import morgan from 'morgan';
import ms from 'ms';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: ['error', 'warn'],
  });

  const configService = app.get(ConfigService);

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      validateCustomDecorators: true,
      errorHttpStatusCode: HttpStatus.BAD_REQUEST,
    })
  );
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      excludePrefixes: ['_'],
      enableImplicitConversion: true,
    })
  );

  app.use(morgan('dev'));

  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle(configService.get('application.name'))
      .setDescription(configService.get('application.description'))
      .setVersion(configService.get('application.version'))
      .addBearerAuth()
      .build()
  );

  SwaggerModule.setup('/api-docs', app, document, {
    useGlobalPrefix: false,
    explorer: true,
    jsonDocumentUrl: '/api-json',
    yamlDocumentUrl: '/api-yaml',

    swaggerOptions: {
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
      persistAuthorization: true,
      operationsSorter: 'alpha',
      tagsSorter: 'alpha',
    },
  });

  app.connectMicroservice({
    transport: Transport.REDIS,
    options: {
      host: configService.get('redis.host'),
      port: configService.get('redis.port'),
      db: configService.get('redis.db'),
      retryAttempts: 5,
      retryDelay: ms('5s'),
      commandTimeout: ms('60s'),
    },
  });

  await app.startAllMicroservices();

  const port = process.env.PORT || configService.get('port');
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );

  const swaggerUrl = `http://localhost:${port}/api-docs`;
  Logger.log(`🚀 Swagger is running on: ${swaggerUrl}`);
}

bootstrap();
