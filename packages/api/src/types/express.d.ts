import { UserEntity } from '@huebot-hub-core/common';

declare global {
  namespace Express {
    export interface Request {
      user?: UserEntity;
    }
  }
}

declare module 'express-session' {
  interface SessionData {
    userId?: string;
  }
}

export {};
