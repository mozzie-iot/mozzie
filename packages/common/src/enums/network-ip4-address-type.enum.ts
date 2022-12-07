import { registerEnumType } from '@nestjs/graphql';

export enum NetworkIp4AddressTypeEnum {
  STATIC = 'static',
  DYNAMIC = 'dynamic',
}

registerEnumType(NetworkIp4AddressTypeEnum, {
  name: 'NetworkIp4AddressTypeEnum',
});
