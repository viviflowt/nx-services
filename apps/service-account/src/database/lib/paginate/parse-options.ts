import { BadRequestException } from '@nestjs/common';
import { PaginationOptions } from "../interfaces";
import { getCache } from './get-cache';
import { getLimit } from './get-limit';
import { getOrder } from './get-order';
import { getPage } from './get-page';

export const parseOptions = <Entity>(
  options: Partial<PaginationOptions<Entity>> = {},
) => {
  try {
    return {
      page: getPage(options),
      limit: getLimit(options),
      order: getOrder(options),
      cache: getCache(options),
    };
  } catch (error) {
    throw new BadRequestException(error.message);
  }
};
