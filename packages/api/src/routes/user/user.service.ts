import { HttpStatus, Injectable } from '@nestjs/common';
import { compareSync } from 'bcryptjs';
import { Request, Response } from 'express';

import {
  UserEntityService,
  ConfigService,
  UserEntity,
} from '@huebot-hub-core/common';

import { UserCreateDto } from './dto/create.dto';
import { UserLoginDto } from './dto/login.dto';

@Injectable()
export class UserService {
  constructor(
    private userService: UserEntityService,
    private readonly configService: ConfigService,
  ) {}

  public async create(input: UserCreateDto): Promise<void> {
    const user = new UserEntity();
    user.username = input.username;
    user.password = input.password;
    user.role = input.role;
    await this.userService.save(user);
  }

  public async login(req: Request, input: UserLoginDto): Promise<string> {
    const user = await this.userService.repo.findOne({
      where: { username: input.username },
    });

    if (!user || !compareSync(input.password, user.password)) {
      throw Error('Invalid email or password!');
    }

    req.session.userId = user.id;

    return req.sessionID;
  }

  public async logout(req: Request, res: Response): Promise<void> {
    const destroy = new Promise((resolve, reject) =>
      req.session.destroy((err) => {
        if (err) {
          return reject(err);
        }

        return resolve(null);
      }),
    );

    try {
      await destroy;
      res.clearCookie(this.configService.SESSION_NAME);
      res.status(HttpStatus.OK);
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST);
    }
  }
}
