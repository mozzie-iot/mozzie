import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { compareSync } from 'bcryptjs';

import { AuthService } from '@huebot-api/auth/auth.service';
import { ROLES } from '@huebot-api/roles/roles.constant';
import { UserEntityService, UserEntity } from '@huebot-hub-core/common';

import { UserCreateDto } from './dto/create.dto';
import { UserLoginDto } from './dto/login.dto';

@Injectable()
export class UserService {
  constructor(
    private userService: UserEntityService,
    private readonly authService: AuthService,
  ) {}

  public async create(input: UserCreateDto): Promise<void> {
    const user_exists = await this.userService.repo.findOne({
      where: { username: input.username },
    });

    if (user_exists) {
      throw new HttpException(
        `Username '${input.username}' is already in use`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!ROLES.includes(input.role)) {
      throw new HttpException(
        `Unsupported role provided: ${input.role}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (input.role === 'admin') {
      throw new HttpException(
        "Users with 'admin' role must be created via CLI",
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = new UserEntity();
    user.username = input.username;
    user.password = input.password;
    user.role = input.role;
    await this.userService.save(user);
  }

  public async login(input: UserLoginDto) {
    const user = await this.userService.repo.findOne({
      where: { username: input.username },
    });

    if (!user || !compareSync(input.password, user.password)) {
      throw new HttpException(
        'Invalid username or password!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const tokens = await this.authService.getTokens(user);

    await this.userService.repo.update(user.id, {
      refresh_token: tokens.refreshToken,
    });

    return tokens;
  }

  public async refreshTokens(user: UserEntity) {
    const tokens = await this.authService.getTokens(user);

    await this.userService.repo.update(user.id, {
      refresh_token: tokens.refreshToken,
    });

    return tokens;
  }

  public async logout(userId: string): Promise<void> {
    await this.userService.repo.update(userId, {
      refresh_token: null,
    });
  }
}
