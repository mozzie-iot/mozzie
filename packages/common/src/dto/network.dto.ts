import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class NetworkWifiDto {
  @Field(() => String)
  public ssid!: string;
  @Field(() => Int)
  readonly signal!: number;
  @Field(() => String, { nullable: true })
  public security?: string;
  @Field(() => Int, { nullable: true })
  public channel?: number;
}
