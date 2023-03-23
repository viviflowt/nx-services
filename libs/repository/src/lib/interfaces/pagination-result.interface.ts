import { PaginationMetadata } from './pagination-metadata.interface';

export interface PaginationResult<Entity> {
  items: Entity[];
  meta: PaginationMetadata;
}
