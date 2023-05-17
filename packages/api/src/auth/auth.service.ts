import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ConfigService, UserEntity } from '@huebot/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  public async getTokens(user: UserEntity) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          userId: user.id,
        },
        {
          secret: this.configService.ACCESS_TOKEN_SECRET,
          expiresIn: this.configService.ACCESS_TOKEN_EXP,
        },
      ),
      this.jwtService.signAsync(
        {
          userId: user.id,
        },
        {
          secret: this.configService.REFRESH_TOKEN_SECRET,
          expiresIn: this.configService.REFRESH_TOKEN_EXP,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
