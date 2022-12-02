import { Injectable } from '@nestjs/common';

@Injectable()
export class NetworkService {
  public pingNetwork(): boolean {
    return true;
  }
}
