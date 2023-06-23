import { IsString } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity('roles')
export class RoleEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'text' })
  @IsString()
  public nickname!: string;

  // USERS

  @Column({ type: 'boolean', default: false })
  public user_read: boolean;

  @Column({ type: 'boolean', default: false })
  public user_write: boolean;

  @Column({ type: 'boolean', default: false })
  public user_delete: boolean;

  // API KEY

  @Column({ type: 'boolean', default: false })
  public api_key_read: boolean;

  @Column({ type: 'boolean', default: false })
  public api_key_write: boolean;

  @Column({ type: 'boolean', default: false })
  public api_key_delete: boolean;

  // ROLES

  @Column({ type: 'boolean', default: false })
  public role_read: boolean;

  @Column({ type: 'boolean', default: false })
  public role_write: boolean;

  @Column({ type: 'boolean', default: false })
  public role_delete: boolean;

  // NODES

  @Column({ type: 'boolean', default: false })
  public node_read: boolean;

  @Column({ type: 'boolean', default: false })
  public node_write: boolean;
}
