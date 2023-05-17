import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { ConfigService, UserEntityService } from '@huebot/common';

type JwtPayload = {
  userId: string;
};

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    configService: ConfigService,
    private readonly userService: UserEntityService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.REFRESH_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, { userId }: JwtPayload) {
    const refreshToken = req.get('Authorization').replace('Bearer', '').trim();

    const user = await this.userService.repo.findOne({ where: { id: userId } });

    if (user.refresh_token !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return user;
  }
}
