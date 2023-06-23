import { UserEntity, ApiKeyEntity } from '@huebot/common';

declare global {
  namespace Express {
    export interface Request {
      user?: UserEntity;
      api_key?: ApiKeyEntity;
    }
  }
}

declare module 'express-session' {
  interface SessionData {
    user_id?: string;
  }
}

export {};
