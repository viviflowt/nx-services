import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiInternalServerErrorResponse } from '@nestjs/swagger';

export const IS_PUBLIC_KEY = 'isPublic';

export const Public = () => {
  return applyDecorators(
    SetMetadata(IS_PUBLIC_KEY, true),
    ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  );
};
