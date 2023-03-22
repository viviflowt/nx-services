import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PaginationResult } from '../../infra/database/repositories/base.repository';
import { PaginatedResponseValueObject } from '../mappings/paginated';
export const ApiPaginatedOkResponse = <T extends Type<any>>(options: {
  type: T;
  description?: string;
}) =>
  applyDecorators(
    ApiExtraModels(PaginatedResponseValueObject, options.type),
    ApiOkResponse({
      description: options.description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginationResult<T>) },
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
    }),
  );
