import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { NodeEntity, NodeEntityModule } from '@huebot-hub-core/common';

import { NodeSetupCredentialsDto } from './dto/setup.dto';
import { CreateNodeInput } from './inputs/input.create';
import { NodeService } from './node.service';

@Resolver(NodeEntityModule)
export class NodeResolver {
  constructor(protected readonly nodeService: NodeService) {}

  @Mutation(() => NodeEntity)
  async createNode(@Args('input') input: CreateNodeInput): Promise<NodeEntity> {
    return this.nodeService.create(input);
  }

  @Query(() => NodeSetupCredentialsDto)
  async getNodeSetupCredentials(): Promise<NodeSetupCredentialsDto> {
    return this.nodeService.get_setup_credentials();
  }

  @Query(() => [NodeEntity])
  async findAllNodes(): Promise<Partial<NodeEntity>[]> {
    return this.nodeService.findAll();
  }
}
