import { Module } from '@nestjs/common';

import { ConfigEntityModule, UserEntityModule } from '@huebot-hub-core/common';

import { AuthRouteService } from './auth.service';

@Module({
  imports: [UserEntityModule, ConfigEntityModule],
  providers: [AuthRouteService],
  exports: [AuthRouteService],
})
export class AuthRouteModule {}
