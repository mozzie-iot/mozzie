import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, Column, PrimaryColumn } from 'typeorm';

import { NodeTypeEnum } from '@huebot-common/enums';

import { BaseEntity } from '../base';

// Currently, whenever a user signs up they will get assigned an admin account
// because all inital Huebot users will be open source users.
// Eventually user's will need to deliberately sign up for admin accounts

@Entity('nodes')
@ObjectType()
export class NodeEntity extends BaseEntity {
  // Node instance_id (generated on reset) is
  // set as node id
  @PrimaryColumn('uuid')
  @Field(() => ID)
  public id!: string;

  @Column('text', { nullable: false })
  @Field(() => ID, { nullable: false })
  public public_key!: string;

  @Column('text', { nullable: false })
  @Field(() => NodeTypeEnum, { nullable: false })
  public type!: NodeTypeEnum;

  @Column('text', { nullable: false })
  @Field(() => String, { nullable: false })
  public name!: string;

  @Column('text', { nullable: false })
  @Field(() => String, { nullable: false })
  public nickname!: string;

  @Column('text', { nullable: false })
  @Field(() => String, { nullable: false })
  public icon!: string;
}
