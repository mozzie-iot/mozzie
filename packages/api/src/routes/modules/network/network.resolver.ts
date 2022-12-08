import { UseGuards } from '@nestjs/common';
import { Resolver, Query } from '@nestjs/graphql';
import { Observable } from 'rxjs';

import { DevGuard } from '@huebot-api/routes/routes-dev.guard';
import {
  BasicResponseEnum,
  NetworkApCredentialsDto,
  NetworkDetailUnion,
  NetworkWifiDto,
} from '@huebot-hub-core/common';

import { NetworkService } from './network.service';

@Resolver('network')
export class NetworkResolver {
  constructor(protected readonly networkService: NetworkService) {}

  /**
   *  Check network connection. Used before instance
   *  setup so no auth required.
   */
  @Query(() => Boolean)
  pingNetwork(): boolean {
    return this.networkService.pingNetwork();
  }

  @Query(() => NetworkApCredentialsDto)
  getNodeApCredentials(): Observable<NetworkApCredentialsDto> {
    return this.networkService.getNodeApCredentials();
  }

  @Query(() => NetworkDetailUnion, { nullable: true })
  networkGetDetails(): Observable<typeof NetworkDetailUnion> {
    return this.networkService.getDetails();
  }

  // Testing Routes
  @UseGuards(DevGuard)
  @Query(() => [NetworkWifiDto])
  testGetAvailableWifiNetworks(): Observable<NetworkWifiDto[]> {
    return this.networkService.getAvailableWifiNetworks();
  }

  @UseGuards(DevGuard)
  @Query(() => BasicResponseEnum)
  testCreateApInterface(): Observable<BasicResponseEnum> {
    return this.networkService.createApInterface();
  }
}
