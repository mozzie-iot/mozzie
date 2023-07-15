import { IsInt, IsString } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

import { AccessRolesEnum } from '../enums';

@Entity('roles')
export class RoleEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'text' })
  @IsString()
  public nickname!: string;

  @Column({ type: 'text' })
  @IsString()
  public description!: string;

  @Column({ type: 'int' })
  @IsInt()
  public sort!: number;

  // CONTROLLERS

  @Column({ type: 'boolean', default: false })
  public [AccessRolesEnum.CONTROLLER_READ]: boolean;

  @Column({ type: 'boolean', default: false })
  public [AccessRolesEnum.CONTROLLER_WRITE]: boolean;

  @Column({ type: 'boolean', default: false })
  public [AccessRolesEnum.CONTROLLER_DELETE]: boolean;

  @Column({ type: 'boolean', default: false })
  public [AccessRolesEnum.CONTROLLER_RUN]: boolean;

  // USERS

  @Column({ type: 'boolean', default: false })
  public [AccessRolesEnum.USER_READ]: boolean;

  @Column({ type: 'boolean', default: false })
  public [AccessRolesEnum.USER_WRITE]: boolean;

  @Column({ type: 'boolean', default: false })
  public [AccessRolesEnum.USER_DELETE]: boolean;

  // API KEY

  @Column({ type: 'boolean', default: false })
  public [AccessRolesEnum.API_KEY_READ]: boolean;

  @Column({ type: 'boolean', default: false })
  public [AccessRolesEnum.API_KEY_WRITE]: boolean;

  @Column({ type: 'boolean', default: false })
  public [AccessRolesEnum.API_KEY_DELETE]: boolean;

  // ROLES

  @Column({ type: 'boolean', default: false })
  public [AccessRolesEnum.ROLE_READ]: boolean;

  @Column({ type: 'boolean', default: false })
  public [AccessRolesEnum.ROLE_WRITE]: boolean;

  @Column({ type: 'boolean', default: false })
  public [AccessRolesEnum.ROLE_DELETE]: boolean;

  // MQTT BROKER ACCESS

  @Column({ type: 'boolean', default: false })
  public [AccessRolesEnum.BROKER_ACCESS_READ]: boolean;

  @Column({ type: 'boolean', default: false })
  public [AccessRolesEnum.BROKER_ACCESS_WRITE]: boolean;

  @Column({ type: 'boolean', default: false })
  public [AccessRolesEnum.BROKER_ACCESS_DELETE]: boolean;

  // SYSTEM

  @Column({ type: 'boolean', default: false })
  public [AccessRolesEnum.SYSTEM_READ]: boolean;

  @Column({ type: 'boolean', default: false })
  public [AccessRolesEnum.SYSTEM_WRITE]: boolean;

  @Column({ type: 'boolean', default: false })
  public [AccessRolesEnum.SYSTEM_DELETE]: boolean;
}
