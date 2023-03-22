/* eslint-disable @typescript-eslint/no-explicit-any */
import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

import { PaginatedResult } from '../dto';

export const ApiOkPaginatedResponse = <T extends Type<any>>(options: {
  type: T;
  description?: string;
}) =>
  applyDecorators(
    ApiExtraModels(PaginatedResult, options.type),
    ApiOkResponse({
      description: options.description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedResult<T>) },
          {
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(options.type) },
              },
            },
          },
        ],
      },
    })
  );
