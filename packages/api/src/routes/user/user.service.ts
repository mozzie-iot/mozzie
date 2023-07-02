import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { compareSync } from 'bcryptjs';
import { Request, Response } from 'express';

import {
  UserEntityService,
  UserEntity,
  ConfigService,
  RoleEntityService,
  UserCreateDto,
  UserLoginDto,
} from '@huebot/common';

@Injectable()
export class UserService {
  constructor(
    private userService: UserEntityService,
    private roleService: RoleEntityService,
    private configService: ConfigService,
  ) {}

  public async create_admin(input: UserCreateDto) {
    const users = await this.userService.repo.count();

    if (users > 0) {
      throw new HttpException(
        'Hub admin already created',
        HttpStatus.FORBIDDEN,
      );
    }

    const user = new UserEntity();
    user.email = input.email;
    user.password = input.password;
    user.is_admin = true;
    await this.userService.save(user);

    return user;
  }

  public async create(input: UserCreateDto) {
    const user_exists = await this.userService.repo.findOne({
      where: { email: input.email },
    });

    if (user_exists) {
      throw new HttpException(
        `'${input.email}' is already in use`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = new UserEntity();
    user.email = input.email;
    user.password = input.password;
    user.temp_password = true;

    if (input.role === 'admin') {
      user.is_admin = true;
    } else {
      const role = await this.roleService.repo.findOne({
        where: { nickname: input.role },
      });

      if (!role) {
        throw new HttpException(
          `Role not found: ${input.role}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      user.role = role;
    }

    await this.userService.save(user);

    return user;
  }

  public async login(req: Request, input: UserLoginDto) {
    const user = await this.userService.repo.findOne({
      where: { email: input.email },
    });

    if (!user || !compareSync(input.password, user.password)) {
      throw new HttpException(
        'Invalid email or password!',
        HttpStatus.BAD_REQUEST,
      );
    }

    req.session.user_id = user.id;

    return user;
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

  public async findAll() {
    return this.userService.repo.find({ relations: ['role'] });
  }
}
