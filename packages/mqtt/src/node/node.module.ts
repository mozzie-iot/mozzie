import { Module } from '@nestjs/common';

import { NodeController } from './node.controller';

@Module({
  imports: [],
  controllers: [NodeController],
})
export class NodeModule {}
