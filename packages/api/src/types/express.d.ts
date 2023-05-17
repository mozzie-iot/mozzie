import { UserEntity } from '@huebot/common';

declare global {
  namespace Express {
    class User extends UserEntity {}
  }
}

export {};
