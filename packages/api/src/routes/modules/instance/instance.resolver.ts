import { Resolver, Mutation, Args } from '@nestjs/graphql';

import { BasicResponseEnum } from '@huebot-hub-core/common';

import { InstanceService } from './instance.service';

@Resolver('hub/instance')
export class InstanceResolver {
  constructor(protected readonly instanceService: InstanceService) {}

  @Mutation(() => BasicResponseEnum)
  async setupHubInstance(
    @Args('token') token: string,
  ): Promise<BasicResponseEnum> {
    return this.instanceService.setup(token);
  }
}
