import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { Roles } from '@huebot-api/roles/roles.decorator';
import { RolesGuard } from '@huebot-api/roles/roles.guard';

import { NodeService } from './node.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('')
export class NodeController {
  constructor(private nodeService: NodeService) {}

  @Get('test')
  @Roles('operator')
  @UseGuards(RolesGuard)
  async test() {
    return this.nodeService.test();
  }
}
