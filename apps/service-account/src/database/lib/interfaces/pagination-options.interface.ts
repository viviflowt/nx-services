import { OrderOptions } from '../types/order-options';

export interface PaginationOptions<Entity> {
  page?: number;
  limit?: number;
  order?: OrderOptions<Entity>;
  cache?: boolean;
}
