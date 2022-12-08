import { createUnionType } from '@nestjs/graphql';

import {
  NetworkWifiDetailDto,
  NetworkWiredDetailDto,
} from '@huebot-common/dto';

export const NetworkDetailUnion = createUnionType({
  name: 'NetworkDetailUnion',
  types: () => [NetworkWifiDetailDto, NetworkWiredDetailDto] as const,
});
