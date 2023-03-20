import { UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';

import { AuthRouteGuard } from '@huebot-api/routes/auth/auth.guard';
import { BasicResponseEnum } from '@huebot-hub-core/common';

import { HubInstanceMqttCredentialsDto } from './dto/mqtt-credentials.dto';
import { InstanceService } from './instance.service';

@Resolver('hub/instance')
export class InstanceResolver {
  constructor(protected readonly instanceService: InstanceService) { }

  @Mutation(() => BasicResponseEnum)
  async setupHubInstance(
    @Args('token') token: string,
  ): Promise<BasicResponseEnum> {
    return this.instanceService.setup(token);
  }

  @UseGuards(AuthRouteGuard)
  @Query(() => HubInstanceMqttCredentialsDto)
  async getHubMqttCredentials(): Promise<HubInstanceMqttCredentialsDto> {
    return this.instanceService.get_mqtt_credentials();
  }
}
