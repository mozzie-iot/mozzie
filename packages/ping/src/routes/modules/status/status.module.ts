import { Module } from '@nestjs/common';

import { StatusResolver } from './status.resolver';
import { StatusService } from './status.service';

@Module({
  providers: [StatusService, StatusResolver],
})
export class StatusModule {}
