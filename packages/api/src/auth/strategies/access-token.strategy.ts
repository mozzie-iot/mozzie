import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { ConfigService, UserEntityService } from '@huebot/common';

type JwtPayload = {
  userId: string;
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private readonly userService: UserEntityService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.ACCESS_TOKEN_SECRET,
    });
  }

  async validate({ userId }: JwtPayload) {
    const user = await this.userService.repo.findOne({ where: { id: userId } });
    return user;
  }
}
