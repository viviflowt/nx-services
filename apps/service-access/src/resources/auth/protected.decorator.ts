import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export const Protected = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Invalid or expired token' }),
    ApiForbiddenResponse({
      description: 'Not enough permissions to access this resource',
    }),
    ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  );
};
