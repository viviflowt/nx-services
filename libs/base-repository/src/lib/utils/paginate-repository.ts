import f from 'lodash/fp';
import { FindManyOptions, Repository } from 'typeorm';
import { PaginatedResponse } from '../dto';
import { PaginationOptions } from '../interfaces';
import { OrderOptions } from '../types/order-options';
import { parseOptions } from './parse-options';

const debug = require('debug')('pagination');

export async function paginateRepository<Entity>(
  options: PaginationOptions<Entity>,
  repository: Repository<Entity>,
  findOptions?: Omit<
    FindManyOptions<Entity>,
    'skip' | 'take' | 'order' | 'cache'
  >
): Promise<PaginatedResponse<Entity>> {
  const { page, limit, order, cache } = f.memoize(parseOptions)(options);

  debug('options %o', { page, limit, order });

  const [items, total] = await repository.findAndCount({
    ...f.omit(['page', 'limit', 'order', 'cache'])(findOptions),
    skip: (page - 1) * limit,
    take: limit,
    order: f.memoize(
      f.pipe(
        f.defaultTo([]),
        f.compact,
        f.map(([field, direction]) => [f.camelCase(field), direction]) as (
          order: OrderOptions<Entity>
        ) => [string, 'ASC' | 'DESC'][],
        f.fromPairs
      )
    )(order),
    cache,
  });

  return new PaginatedResponse({
    items,
    page,
    limit,
    total,
  });
}
