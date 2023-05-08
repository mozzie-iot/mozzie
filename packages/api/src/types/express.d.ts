import { UserEntity } from '@huebot-hub-core/common';

declare global {
  namespace Express {
    class User extends UserEntity {}
  }
}

export {};
