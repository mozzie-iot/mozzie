import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Observable } from 'rxjs';

import { DevGuard } from '@huebot-api/routes/routes-dev.guard';
import {
  BasicResponseEnum,
  NetworkApCredentialsDto,
  NetworkAvailableDto,
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
  @Query(() => NetworkDetailUnion, { nullable: true })
  testGetNetworkGetDetails(): Observable<typeof NetworkDetailUnion> {
    return this.networkService.getDetails();
  }

  @UseGuards(DevGuard)
  @Query(() => [NetworkWifiDto])
  testGetAvailableWifiNetworks(): Observable<NetworkWifiDto[]> {
    return this.networkService.getAvailableWifiNetworks();
  }

  @UseGuards(DevGuard)
  @Query(() => String)
  testGetApInteface(): Observable<string> {
    return this.networkService.getApInterface();
  }

  @UseGuards(DevGuard)
  @Query(() => [NetworkAvailableDto])
  testGetAvailableInterfaces(): Observable<NetworkAvailableDto[]> {
    return this.networkService.getAvailableInterfaces();
  }

  @UseGuards(DevGuard)
  @Query(() => NetworkAvailableDto, { nullable: true })
  testGetActiveInterface(): Observable<NetworkAvailableDto | null> {
    return this.networkService.getActiveInterface();
  }

  @UseGuards(DevGuard)
  @Query(() => String, { nullable: true })
  testGetActiveSSID(): Observable<string | null> {
    return this.networkService.getActiveSSID();
  }

  @Mutation(() => BasicResponseEnum)
  testConnectToWifi(
    @Args('ssid') ssid: string,
    @Args('password') password: string,
  ): Observable<BasicResponseEnum> {
    return this.networkService.connectToWifi(ssid, password);
  }

  @UseGuards(DevGuard)
  @Mutation(() => BasicResponseEnum)
  testCreateApInterface(): Observable<BasicResponseEnum> {
    return this.networkService.createApInterface();
  }

  @UseGuards(DevGuard)
  @Mutation(() => BasicResponseEnum)
  testDeleteApInterface(): Observable<BasicResponseEnum> {
    return this.networkService.deleteApInterface();
  }
}
