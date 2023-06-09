import bcrypt from 'bcryptjs';
import { Exclude } from 'class-transformer';
import f from 'lodash/fp';
import {
  BaseEntity,
  Check,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum AccountStatus {
  Active = 'active',
  Inactive = 'inactive',
  Restricted = 'restricted',
}

@Entity()
export class Account extends BaseEntity {
  constructor(partial: Partial<Account>) {
    super();
    Object.assign(this, partial);
    // Object.freeze(this.id);
    // Object.freeze(this.password);
    // Object.freeze(this.createdAt);
  }

  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column({
    nullable: true,
    transformer: {
      from: f.identity,
      to: f.pipe(f.trim),
    },
  })
  firstName?: string;

  @Column({
    nullable: true,
    transformer: {
      from: f.pipe(f.trim),
      to: f.identity,
    },
  })
  lastName: string;

  @Column({
    transformer: {
      from: f.identity,
      to: f.pipe(f.toLower, f.trim),
    },
    unique: true,
  })
  email: string;

  @Column({
    transformer: {
      from: f.identity,
      to: f.pipe((value: string) => bcrypt.hashSync(value, 10)),
    },
  })
  @Check(`LENGTH(password) >= 60`)
  @Exclude()
  password: string;

  @Column({ enum: AccountStatus, default: AccountStatus.Active })
  status: AccountStatus;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;

  @DeleteDateColumn()
  @Exclude({ toPlainOnly: true })
  readonly deletedAt?: Date;
}
