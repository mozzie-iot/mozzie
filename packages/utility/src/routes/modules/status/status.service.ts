import { Injectable } from '@nestjs/common';

@Injectable()
export class StatusService {
  public getStatus(): boolean {
    return true;
  }
}
