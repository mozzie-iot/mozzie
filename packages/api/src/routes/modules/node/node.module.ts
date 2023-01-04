import { Module } from '@nestjs/common';

import { NodeEntityModule } from '@huebot-hub-core/common';

import { NodeResolver } from './node.resolver';
import { NodeService } from './node.service';

@Module({
  imports: [NodeEntityModule],
  providers: [NodeService, NodeResolver],
})
export class NodeModule {}
