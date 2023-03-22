import { Field, ObjectType } from '@nestjs/graphql';

import { InstanceRoleEnum, UserEntity } from '@huebot-hub-core/common';

@ObjectType()
export class AuthRouteDto {
  @Field()
  public user: UserEntity;

  @Field(() => InstanceRoleEnum)
  public role: InstanceRoleEnum;
}
