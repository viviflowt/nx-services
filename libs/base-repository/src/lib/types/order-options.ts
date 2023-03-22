import { StringKeyOf } from 'type-fest';

export type OrderOptions<Entity> =
  | StringKeyOf<Entity>
  | StringKeyOf<Entity>[]
  | `${'+' | '-'}${StringKeyOf<Entity>}`
  | `${'+' | '-'}${StringKeyOf<Entity>}`[];
