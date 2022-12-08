import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from '../base';

@Entity('config')
export class ConfigEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  public id!: number;

  @Column('text')
  public name!: string;

  @Column('text')
  public value!: string;
}
