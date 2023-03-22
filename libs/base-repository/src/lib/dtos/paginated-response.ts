import { PaginationMetadata } from "../interfaces";

export class PaginatedResponse<Entity> {
  items: Entity[];
  meta: PaginationMetadata;

  constructor(data: {
    items: Entity[];
    page: number;
    limit: number;
    total: number;
  }) {
    const { items, page, limit, total } = data;

    if (page < 1 || limit < 1 || total < 0) {
      throw new Error('Invalid data');
    }

    this.items = items;
    this.meta = {
      page,
      limit,
      pages: Math.ceil(total / limit),
      total,
    };
  }
}
