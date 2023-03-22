import { Query, Resolver } from '@nestjs/graphql';

import { StatusService } from './status.service';

@Resolver('ping/status')
export class StatusResolver {
  constructor(protected readonly statusService: StatusService) {}

  @Query(() => Boolean)
  getStatus(): boolean {
    return this.statusService.getStatus();
  }
}
