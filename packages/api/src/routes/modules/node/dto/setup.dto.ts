import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class NodeSetupCredentialsDto {
  @Field(() => String)
  public ap_ssid!: string;
  @Field(() => String)
  public ap_password!: string;
  @Field(() => String)
  public mqtt_username!: string;
  @Field(() => String)
  public mqtt_password!: string;
}
