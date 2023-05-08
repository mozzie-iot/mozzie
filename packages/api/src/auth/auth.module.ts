import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UserEntityModule } from '@huebot-hub-core/common';

import { AuthService } from './auth.service';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';

@Module({
  imports: [JwtModule.register({}), UserEntityModule],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
  exports: [AuthService],
})
export class AuthModule {}
