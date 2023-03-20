import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class HubInstanceMqttCredentialsDto {
  @Field(() => String)
  public username!: string;
  @Field(() => String)
  public password!: string;
}
