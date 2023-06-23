import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { Role } from '@huebot/role/role.decorator';
import { RoleEnum } from '@huebot/role/role.enum';

import { AuthGuard } from '../auth.guard';

import { NodeRetrieveDto } from './dto/retrieve.dto';
import { NodeSendDto } from './dto/send.dto';
import { NodeService } from './node.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller({ path: 'nodes', version: '1' })
export class NodeController {
  constructor(private nodeService: NodeService) {}

  @Get('online')
  @Role(RoleEnum.node_read)
  @UseGuards(AuthGuard)
  online() {
    return this.nodeService.online();
  }

  @Post('send')
  @Role(RoleEnum.node_write)
  @UseGuards(AuthGuard)
  send(@Body() input: NodeSendDto) {
    return this.nodeService.send(input);
  }

  @Get('sensor')
  @Role(RoleEnum.node_read)
  @UseGuards(AuthGuard)
  sensor(@Body() input: NodeRetrieveDto) {
    return this.nodeService.sensor(input);
  }
}
