import {
  applyDecorators,
  ClassSerializerInterceptor,
  HttpStatus,
  SerializeOptions,
  UseFilters,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { HttpExceptionFilter } from '../filters';
export const ControllerSetup = () => {
  return applyDecorators(
    UseInterceptors(ClassSerializerInterceptor),
    UsePipes(
      new ValidationPipe({
        transform: true,
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        validateCustomDecorators: true,
      })
    ),
    SerializeOptions({
      excludePrefixes: ['_'],
    }),
    UseFilters(new HttpExceptionFilter())
  );
};
