import { Injectable } from '@nestjs/common';

@Injectable()
export class NodeService {
  public async test(): Promise<string> {
    return 'success';
  }
}
