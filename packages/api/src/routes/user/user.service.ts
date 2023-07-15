import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { Request, Response } from 'express';
import { Repository } from 'typeorm';

import {
  UserEntity,
  ConfigService,
  UserCreateDto,
  UserLoginDto,
  UserUpdateDto,
  ResetPasswordDto,
  RoleEntity,
} from '@huebot/common';
import { DatabaseCrudService } from '@huebot/database/database-crud.service';

@Injectable()
export class UserService extends DatabaseCrudService<UserEntity> {
  constructor(
    private configService: ConfigService,
    @InjectRepository(UserEntity)
    protected readonly repository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    protected readonly roleRepo: Repository<RoleEntity>,
  ) {
    super();
  }

  public async create_admin(input: UserCreateDto) {
    const users = await this.repository.count();

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
    await this.repository.save(user);

    return user;
  }

  public async create(input: UserCreateDto) {
    const user_exists = await this.repository.findOne({
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
      const role = await this.roleRepo.findOne({
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

    await this.repository.save(user);

    return user;
  }

  public async login(req: Request, input: UserLoginDto) {
    const user = await this.repository.findOne({
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
    return this.repository.find({ relations: ['role'] });
  }

  public async findOne(id: string): Promise<UserEntity | undefined> {
    return this.repository.findOne({
      where: { id },
      relations: ['role'],
    });
  }

  public async update(id: string, input: UserUpdateDto) {
    const user = await this.repository.findOne({
      where: { id },
    });

    if (!user) {
      throw new HttpException(
        `User not found with ID: ${id}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (input.role) {
      if (input.role === 'admin') {
        user.is_admin = true;
      } else {
        const role = await this.roleRepo.findOne({
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
    }

    return this.repository.save(user);
  }

  public async resetPassword(
    id: string,
    input: ResetPasswordDto,
  ): Promise<UserEntity> {
    const user = await this.repository.findOne({
      where: { id },
    });

    if (!user) {
      throw new HttpException(
        `User not found with ID: ${id}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const salt = genSaltSync();
    user.password = hashSync(input.password, salt);
    user.temp_password = true;
    return this.repository.save(user);
  }
}
