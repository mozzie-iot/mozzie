import { Query, Resolver } from '@nestjs/graphql';

import { NodeEntity, NodeEntityModule } from '@huebot-hub-core/common';

import { NodeService } from './node.service';

@Resolver(NodeEntityModule)
export class NodeResolver {
  constructor(protected readonly nodeService: NodeService) {}

  @Query(() => [NodeEntity])
  async findAllNodes(): Promise<Partial<NodeEntity>[]> {
    return this.nodeService.findAll();
  }
}
