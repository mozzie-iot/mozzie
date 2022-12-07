import { UseGuards } from '@nestjs/common';
import { Resolver, Query } from '@nestjs/graphql';
import { Observable } from 'rxjs';

import { DevGuard } from '@huebot-api/routes/routes-dev.guard';
import { NetworkWifiDto } from '@huebot-hub-core/common';

import { NetworkService } from './network.service';

@Resolver('network')
export class NetworkResolver {
  constructor(protected readonly networkService: NetworkService) {}

  /**
   *  Check network connection. Used before instance
   *  setup so no auth required.
   */
  @Query(() => Boolean)
  async pingNetwork(): Promise<boolean> {
    return this.networkService.pingNetwork();
  }

  // Testing Routes
  @UseGuards(DevGuard)
  @Query(() => [NetworkWifiDto])
  testGetAvailableWifiNetworks(): Observable<NetworkWifiDto[]> {
    return this.networkService.getAvailableWifiNetworks();
  }
}
