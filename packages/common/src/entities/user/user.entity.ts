import { genSaltSync, hashSync } from 'bcryptjs';
import { Exclude } from 'class-transformer';
import { IsEmail, MinLength } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  ManyToOne,
  BaseEntity,
} from 'typeorm';

import { RoleEntity } from '../role';

@Entity('users')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'text' })
  @IsEmail()
  public email!: string;

  @Column({ type: 'text' })
  @MinLength(8, { message: 'must be 8 character minimum' })
  @Exclude()
  public password!: string;

  @Column({ type: 'boolean', default: false })
  public is_admin!: boolean;

  @ManyToOne(() => RoleEntity, { nullable: true })
  public role!: RoleEntity;

  @BeforeInsert()
  hashPasswordBeforeInsert() {
    if (this.password) {
      const salt = genSaltSync();
      this.password = hashSync(this.password, salt);
    }
  }
}
