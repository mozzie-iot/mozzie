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
  AfterLoad,
} from 'typeorm';

import { AccessRolesEnum } from '@huebot/enums';

import { RoleEntity } from './role.entity';

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

  @Column({ type: 'boolean', default: false })
  public temp_password!: boolean;

  // Virtual field
  public role_access!: AccessRolesEnum[];

  @BeforeInsert()
  hashPasswordBeforeInsert() {
    if (this.password) {
      const salt = genSaltSync();
      this.password = hashSync(this.password, salt);
    }
  }

  @AfterLoad()
  formatRoles() {
    if (this.role) {
      this.role_access = Object.entries(this.role).reduce(
        (acc: string[], [p, v]) => (v === true ? [p, ...acc] : acc),
        []
      ) as AccessRolesEnum[];

      return;
    }

    this.role_access = [];
  }
}
