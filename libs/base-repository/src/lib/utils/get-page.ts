/* eslint-disable @typescript-eslint/ban-types */
import f from 'lodash/fp';
import { PaginationOptions } from "../interfaces";
export const getPage = <Entity>(
  options: Partial<PaginationOptions<Entity>> = {},
) => {
  const page = f.pipe(
    f.get('page'),
    f.toInteger,
    f.clamp(1, Number.MAX_SAFE_INTEGER),
    f.defaultTo(1),
  )(options);
  return page < 1 ? 1 : page;
};
