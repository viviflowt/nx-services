import f from 'lodash/fp';
import { PaginationOptions } from '../interfaces';
export const getLimit = <Entity>(options: PaginationOptions<Entity> = {}) => {
  const limit = f.pipe(
    f.get('limit'),
    f.toInteger,
    f.clamp(1, Number.MAX_SAFE_INTEGER),
    f.defaultTo(10),
  )(options);
  return limit < 1 ? 1 : limit;
};
