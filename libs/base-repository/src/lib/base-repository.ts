import {
  DataSource,
  EntityManager,
  EntityTarget,
  FindManyOptions,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { IsolationLevel } from 'typeorm/driver/types/IsolationLevel';
import { PaginatedResponse } from './dto';
import { PaginationOptions } from './interfaces';
import { paginateQueryBuilder, paginateRepository } from './utils';

export abstract class BaseRepository<Entity> extends Repository<Entity> {
  constructor(
    public readonly dataSource: DataSource,

    public readonly target: EntityTarget<Entity>
  ) {
    super(
      dataSource.manager.connection.getMetadata(target).name,
      dataSource.manager
    );
  }

  async paginate<Entity>(
    options: Partial<PaginationOptions<Entity>>,
    queryBuilder: SelectQueryBuilder<Entity>
  ): Promise<PaginatedResponse<Entity>>;
  async paginate<Entity>(
    options: Partial<PaginationOptions<Entity>>,
    repository: Repository<Entity>,
    findOptions?: Omit<
      FindManyOptions<Entity>,
      'skip' | 'take' | 'order' | 'cache'
    >
  ): Promise<PaginatedResponse<Entity>>;

  async paginate<Entity>(
    options: Partial<PaginationOptions<Entity>>,
    findOptions?: Omit<
      FindManyOptions<Entity>,
      'skip' | 'take' | 'order' | 'cache'
    >
  ): Promise<PaginatedResponse<Entity>>;

  async paginate<Entity>(
    options: Partial<PaginationOptions<Entity>>,
    context?:
      | SelectQueryBuilder<Entity>
      | Repository<Entity>
      | Omit<FindManyOptions<Entity>, 'skip' | 'take' | 'order' | 'cache'>,
    findOptions?: Omit<
      FindManyOptions<Entity>,
      'skip' | 'take' | 'order' | 'cache'
    >
  ) {
    if (context instanceof SelectQueryBuilder) {
      return paginateQueryBuilder(options, context);
    }

    if (context instanceof Repository) {
      return paginateRepository(options, context, { ...(findOptions ?? {}) });
    }

    return paginateRepository(options, this as Repository<any>, {
      ...(context ?? {}),
      ...(findOptions ?? {}),
    });
  }

  async transaction<T>(
    runInTransaction: (entityManager: EntityManager) => Promise<T>
  ): Promise<T>;
  async transaction<T>(
    isolationLevel: IsolationLevel,
    runInTransaction: (entityManager: EntityManager) => Promise<T>
  ): Promise<T>;

  async transaction<T>(
    ...args:
      | [
          IsolationLevel,
          (transactionalEntityManager: EntityManager) => Promise<T>
        ]
      | [(transactionalEntityManager: EntityManager) => Promise<T>]
  ) {
    if (args.length === 1) {
      const [runInTransaction] = args;
      return this.manager.transaction(runInTransaction);
    }

    const [isolationLevel, runInTransaction]: [
      IsolationLevel,
      (transactionalEntityManager: EntityManager) => Promise<T>
    ] = args;

    return this.manager.transaction(isolationLevel, runInTransaction);
  }
}
