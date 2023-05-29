import { AccessTokenGuard } from '@huebot-api/auth/guards/access-token.guard';
import { Roles } from '@huebot-api/roles/roles.decorator';
import { RolesGuard } from '@huebot-api/roles/roles.guard';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { NodeRetrieveDto } from './dto/retrieve.dto';
import { NodeSendDto } from './dto/send.dto';
import { NodeService } from './node.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class NodeController {
  constructor(private nodeService: NodeService) {}

  @Get('online')
  @Roles('operator')
  @UseGuards(AccessTokenGuard, RolesGuard)
  async online() {
    return this.nodeService.online();
  }

  @Post('send')
  @Roles('operator')
  @UseGuards(AccessTokenGuard, RolesGuard)
  async send(@Body() input: NodeSendDto) {
    return this.nodeService.send(input);
  }

  @Get('retrieve')
  @Roles('operator')
  @UseGuards(AccessTokenGuard, RolesGuard)
  async retrieve(@Body() input: NodeRetrieveDto) {
    return this.nodeService.retrieve(input);
  }
}
