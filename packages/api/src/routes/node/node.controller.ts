import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { Roles } from '../../roles/roles.decorator';
import { RolesGuard } from '../../roles/roles.guard';

import { NodeService } from './node.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('node')
export class NodeController {
  constructor(private nodeService: NodeService) {}

  @Get('test')
  @Roles('operator')
  @UseGuards(RolesGuard)
  async test() {
    return this.nodeService.test();
  }
}
