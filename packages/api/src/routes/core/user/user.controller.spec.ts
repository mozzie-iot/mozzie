import { Test, TestingModule } from '@nestjs/testing';

import { AuthModule } from '@huebot-api/auth/auth.module';
import {
  TypeOrmModule,
  UserEntity,
  UserEntityModule,
} from '@huebot-hub-core/common';

import { UserController } from './user.controller';
import { User } from './user.decorator';
import { UserService } from './user.service';

describe('UserController', () => {
  let module: TestingModule;
  let userController: UserController;
  let userService: UserService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [TypeOrmModule, UserEntityModule, AuthModule],
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    userService = module.get<UserService>(UserService);
    userController = module.get<UserController>(UserController);
  });

  describe('login', () => {
    it('should return a null user', async () => {
      expect(await userController.current_user(null)).toBe(null);
    });
  });

  afterAll(() => {
    module.close();
  });
});
