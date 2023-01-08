import { Module } from '@nestjs/common';

import { NativeClientModule } from '@huebot-api/native-client/native-client.module';
import { NodeEntityModule } from '@huebot-hub-core/common';

import { NodeResolver } from './node.resolver';
import { NodeService } from './node.service';

@Module({
  imports: [NativeClientModule, NodeEntityModule],
  providers: [NodeService, NodeResolver],
})
export class NodeModule {}
