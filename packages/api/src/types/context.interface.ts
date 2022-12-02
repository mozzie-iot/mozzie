import { Response, Request } from 'express';

export interface ExpressContext {
  req: Request;
  res: Response;
}
