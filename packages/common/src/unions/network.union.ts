import { createUnionType } from '@nestjs/graphql';

import {
  NetworkWifiDetailDto,
  NetworkWiredDetailDto,
} from '@huebot-common/dto';
import { NetworkTypeEnum } from '@huebot-common/enums';

export const NetworkDetailUnion = createUnionType({
  name: 'NetworkDetailUnion',
  types: () => [NetworkWifiDetailDto, NetworkWiredDetailDto] as const,
  resolveType(value) {
    if (value.type === NetworkTypeEnum.WIRED) {
      return NetworkWiredDetailDto;
    }

    return NetworkWifiDetailDto;
  },
});
