import f from 'lodash/fp';
import { SelectQueryBuilder } from 'typeorm';
import { PaginatedResponse } from "../dtos";
import { PaginationOptions } from "../interfaces";
import { parseOptions } from './parse-options';

const debug = require('debug')('pagination');

export const paginateQueryBuilder = async <Entity>(
  options: PaginationOptions<Entity>,
  queryBuilder: SelectQueryBuilder<Entity>,
): Promise<PaginatedResponse<Entity>> => {
  const { page, limit, order, cache } = f.memoize(parseOptions)(options);

  debug('options %o', { page, limit, order });

  queryBuilder.skip((page - 1) * limit).take(limit);

  if (order) {
    for (const [field, direction] of Object.entries(order)) {
      const alias = queryBuilder.alias ? `${queryBuilder.alias}.` : '';
      queryBuilder.addOrderBy(`${alias}${field}`, direction);
    }
  }

  if (cache) {
    queryBuilder.cache(cache);
  }

  const [items, total] = await queryBuilder.getManyAndCount();

  return new PaginatedResponse({
    items,
    page,
    limit,
    total,
  });
};
