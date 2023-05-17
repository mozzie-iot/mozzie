import { AuthModule } from '@huebot-api/auth/auth.module';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { TypeOrmModule, UserEntityModule } from '@huebot/common';

import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let module: TestingModule;
  let userController: UserController;

  const input = {
    username: 'test_user',
    password: 'test_pw',
    role: 'operator',
  };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [TypeOrmModule, UserEntityModule, AuthModule],
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    userController = module.get<UserController>(UserController);
  });

  describe('create', () => {
    it('successfully create new user', async () => {
      expect(await userController.create(input)).toBe(undefined);
    });

    it('username already in use', async () => {
      await expect(userController.create(input)).rejects.toThrowError(
        new HttpException(
          `Username '${input.username}' is already in use`,
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('unsupported role', async () => {
      const input = {
        username: 'clark',
        password: 'kent',
        role: 'superman',
      };

      await expect(userController.create(input)).rejects.toThrowError(
        new HttpException(
          `Unsupported role provided: ${input.role}`,
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it("fail to create user with 'admin' role via endpoint", async () => {
      const input = {
        username: 'admin',
        password: 'user',
        role: 'admin',
      };

      await expect(userController.create(input)).rejects.toThrowError(
        new HttpException(
          "Users with 'admin' role must be created via CLI",
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });

  describe('login', () => {
    it('invalid username or password', async () => {
      await expect(
        userController.login({
          username: input.username,
          password: 'bad_password',
        }),
      ).rejects.toThrowError(
        new HttpException(
          'Invalid username or password!',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('successful user login', async () => {
      const login = await userController.login({
        username: input.username,
        password: input.password,
      });

      expect(login).toEqual(
        expect.objectContaining({
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        }),
      );
    });
  });

  afterAll(() => {
    module.close();
  });
});
