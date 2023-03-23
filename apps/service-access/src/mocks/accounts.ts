import { faker } from '@faker-js/faker';
import { randomInt } from 'crypto';
import { EntityManager } from 'typeorm';
import dataSource from '../config/datasource';
import { Account } from '../entities/account.entity';

const createAccount = async (
  manager: EntityManager,
  partial?: Partial<Account>
) => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();

  const emailUser =
    faker.internet.email().toLowerCase().split('@')[0] +
    randomInt(1000, 9999).toString();

  const emailDomain = faker.internet.domainName().toLowerCase();

  const email = `${emailUser}@${emailDomain}`;

  const password = 'password';

  const user = manager.create(Account, {
    firstName,
    lastName,
    email,
    password,
    ...partial,
  });

  await manager.save(user);

  return user;
};

const run = async () => {
  await dataSource.initialize();

  const manager = dataSource.createEntityManager();

  // await createAccount(manager, {
  //   firstName: 'admin',
  //   lastName: 'admin',
  //   email: 'admin@org.com.br',
  //   password: 'admin',
  // });

  await Promise.all(
    Array.from({ length: 1000 }).map(() => createAccount(manager))
  );

  await dataSource.destroy();
};

run();
