import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from '../base';

@Entity('node_channels')
@ObjectType()
export class NodeChannelEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  public id!: string;

  @Column({ type: 'text', nullable: false })
  @Field(() => String, { nullable: false })
  public name!: string;

  @Column({ type: 'integer', nullable: false })
  @Field(() => Int, { nullable: false })
  public channel!: number;
}
