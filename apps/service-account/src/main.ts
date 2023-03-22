/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import morgan from 'morgan';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: ['error', 'warn'],
  });

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  app.use(cookieParser());
  app.use(
    session({
      secret: 'secret',
      resave: false,
      saveUninitialized: false,
    })
  );
  app.use(morgan('dev'));

  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Service Account')
      .setDescription('Service Account API description')
      .setVersion('1.0')
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

  const port = process.env.PORT || 4000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
