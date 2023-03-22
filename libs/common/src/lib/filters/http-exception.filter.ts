import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

import f from 'lodash/fp';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const message = f.pipe(
      f.cond([
        [f.isString, (message) => ({ message })],
        [f.isObject, f.identity],
        [f.T, (message) => ({ message })],
      ]),
      f.omit(['statusCode', 'error', 'timestamp', 'path']),
      f.toPairs,
      f.map(([key, value]) => [
        f.camelCase(key),
        value instanceof Error ? value.message : value,
      ]),
      f.fromPairs
    )(exception?.getResponse());

    response.status(status).json({
      statusCode: status,
      error: exception.name,

      ...message,
      timestamp: new Date().toISOString(),
    });
  }
}
