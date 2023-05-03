import { genSaltSync, hashSync } from 'bcryptjs';
import { Exclude } from 'class-transformer';
import { Length, MinLength } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';

import { BaseEntity } from '../base';

@Entity('users')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'text' })
  @Length(3, 25, { message: 'must be between 3 and 25 characters' })
  public username!: string;

  @Column({ type: 'text' })
  @MinLength(6, { message: 'must be 6 character minimum' })
  @Exclude()
  public password!: string;

  @Column({ type: 'text' })
  public role!: string;

  @Exclude()
  @Column({ type: 'text', nullable: true })
  public refresh_token!: string | null;

  @BeforeInsert()
  hashPasswordBeforeInsert() {
    if (this.password) {
      const salt = genSaltSync();
      this.password = hashSync(this.password, salt);
    }
  }
}
