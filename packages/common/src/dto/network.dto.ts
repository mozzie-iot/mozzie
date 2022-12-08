import { Field, Int, ObjectType } from '@nestjs/graphql';

import {
  NetworkIp4AddressTypeEnum,
  NetworkTypeEnum,
} from '@huebot-common/enums';

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

@ObjectType()
export class NetworkAvailableDto {
  @Field(() => String)
  public name!: string;
  @Field(() => NetworkTypeEnum)
  readonly type!: NetworkTypeEnum;
}

@ObjectType()
export class NetworkActiveDto {
  @Field(() => String)
  public name!: string;
  @Field(() => NetworkTypeEnum)
  readonly type!: NetworkTypeEnum;
  @Field(() => String)
  public type_raw!: string;
}

@ObjectType()
export class NetworkApCredentialsDto {
  @Field(() => String)
  public ssid!: string;
  @Field(() => String)
  public password!: string;
}

@ObjectType()
class NetworkBaseDetailDto {
  @Field(() => String)
  public id!: string;
  @Field(() => NetworkTypeEnum)
  readonly type!: NetworkTypeEnum;
  @Field(() => String)
  readonly ip4_address!: string;
  @Field(() => NetworkIp4AddressTypeEnum)
  readonly ip4_address_type!: NetworkIp4AddressTypeEnum;
  @Field(() => String)
  readonly ip4_gateway!: string;
  @Field(() => String)
  readonly interface_name!: string;
}

@ObjectType()
export class NetworkWifiDetailDto extends NetworkBaseDetailDto {
  @Field(() => String)
  public ssid!: string;
}

@ObjectType()
export class NetworkWiredDetailDto extends NetworkBaseDetailDto {}
