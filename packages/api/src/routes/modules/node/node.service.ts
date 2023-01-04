import { Injectable } from '@nestjs/common';

import { NodeEntity, NodeEntityService } from '@huebot-hub-core/common';

@Injectable()
export class NodeService {
  constructor(private readonly nodeService: NodeEntityService) {}

  public async findAll(): Promise<NodeEntity[]> {
    return this.nodeService.repo.createQueryBuilder('nodes').getMany();
  }
}
