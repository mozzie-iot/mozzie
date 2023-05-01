import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import {
  UserEntityService,
  ConfigService,
  UserEntity,
} from '@huebot-hub-core/common';

import { AdminUserCreateDto } from './dto/create.dto';

@Injectable()
export class UserService {
  constructor(
    private userService: UserEntityService,
    private readonly configService: ConfigService,
  ) {}

  public async create(input: AdminUserCreateDto): Promise<void> {
    const user_exists = await this.userService.repo.findOne({
      where: { username: input.username },
    });

    if (user_exists) {
      throw new HttpException(
        `Username '${input.username}' is already in use`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = new UserEntity();
    user.username = input.username;
    user.password = input.password;
    user.role = 'admin';
    await this.userService.save(user);
  }
}
