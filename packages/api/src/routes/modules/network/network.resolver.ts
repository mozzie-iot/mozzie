import { Resolver, Query } from '@nestjs/graphql';

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
}
