import { Module } from '@nestjs/common';

import { UserEntityModule } from '@huebot/common';

import { NodeController } from './node.controller';
import { NodeService } from './node.service';

@Module({
  imports: [UserEntityModule],
  providers: [NodeService],
  controllers: [NodeController],
})
export class NodeModule {}
