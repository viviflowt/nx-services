import f from 'lodash/fp';
import { PaginationOptions } from '../interfaces';
export const getOrder = <Entity>(
  options: Partial<PaginationOptions<Entity>> = {},
) => {
  return f.memoize(
    f.pipe(
      f.get('order'),
      (order) => (f.isArray(order) ? order : [order]),
      f.defaultTo([]),
      f.compact,
      f.uniq,
      f.map((item) =>
        item.startsWith('-')
          ? [item.replace(/^-/, ''), 'DESC']
          : f.startsWith('+')
          ? [item.replace(/^\+/, ''), 'ASC']
          : [item, 'ASC'],
      ),
      f.map(
        ([field, direction]) => [field, direction] as [string, 'ASC' | 'DESC'],
      ),
      f.fromPairs,
    ),
  )(options) as Record<string, 'ASC' | 'DESC'>;
};
