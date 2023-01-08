import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { BaseEntity } from '../base';
import { NodeEntity } from '../node/node.entity';

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

  @ManyToOne(() => NodeEntity, (node) => node.channels)
  @JoinColumn([{ name: 'node_id' }])
  @Field(() => NodeEntity, { nullable: false })
  public node!: NodeEntity;

  @Column('uuid')
  @Field(() => ID)
  public node_id: string;
}
