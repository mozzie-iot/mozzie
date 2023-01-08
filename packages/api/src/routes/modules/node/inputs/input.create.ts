import { InputType, Field, ID, Int } from '@nestjs/graphql';

import { NodeTypeEnum } from '@huebot-hub-core/common';

@InputType()
export class CreateNodeChannel {
  @Field(() => String)
  public name: string;
  @Field(() => Int)
  public channel!: number;
}

@InputType()
export class CreateNodeInput {
  @Field(() => String)
  readonly model_name!: string;
  @Field(() => String)
  readonly public_key!: string;
  @Field(() => ID)
  readonly instance_key!: string;
  @Field(() => String)
  readonly nickname!: string;
  @Field(() => NodeTypeEnum)
  readonly type!: NodeTypeEnum;
  @Field(() => [CreateNodeChannel], { nullable: true })
  public channels!: CreateNodeChannel[];
}
