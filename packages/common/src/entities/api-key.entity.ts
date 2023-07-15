import { IsString } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Generated,
  ManyToOne,
  BaseEntity,
} from 'typeorm';

import { RoleEntity } from './role.entity';

@Entity('api_keys')
export class ApiKeyEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'text' })
  @IsString()
  public nickname!: string;

  @Column({ type: 'uuid' })
  @Generated('uuid')
  public key!: string;

  @ManyToOne(() => RoleEntity)
  public role!: string;
}
