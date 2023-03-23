import f from 'lodash/fp';
import { PaginationOptions } from '../interfaces';
export const getCache = <Entity>(
  options: Partial<PaginationOptions<Entity>> = {}
) => {
  return f.pipe(f.get('cache'), f.defaultTo(false))(options);
};
