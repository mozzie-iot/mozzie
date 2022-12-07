import { registerEnumType } from '@nestjs/graphql';

export enum NetworkTypeEnum {
  WIRED = 'wired',
  WIFI = 'wifi',
}

registerEnumType(NetworkTypeEnum, {
  name: 'NetworkTypeEnum',
});
