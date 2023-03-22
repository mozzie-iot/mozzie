import { Response, Request } from 'express';

import { AuthRouteDto } from '@huebot-utility/routes/auth/auth.dto';

export interface ExpressContext {
  req: Request;
  res: Response;
  auth: AuthRouteDto;
}
