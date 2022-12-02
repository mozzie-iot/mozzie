import { Injectable, CanActivate } from '@nestjs/common';
import { Observable } from 'rxjs';

import { ConfigService } from '@huebot-hub-core/common';

// Use for development environment only endpoints
@Injectable()
export class DevGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(): boolean | Promise<boolean> | Observable<boolean> {
    return this.configService.NODE_ENV === 'development';
  }
}
