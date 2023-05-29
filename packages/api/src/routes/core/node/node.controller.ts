import { AccessTokenGuard } from '@huebot-api/auth/guards/access-token.guard';
import { Roles } from '@huebot-api/roles/roles.decorator';
import { RolesGuard } from '@huebot-api/roles/roles.guard';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { NodeSendDto } from './dto/send.dto';
import { NodeService } from './node.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class NodeController {
  constructor(private nodeService: NodeService) {}

  @Post('send')
  @Roles('operator')
  @UseGuards(AccessTokenGuard, RolesGuard)
  async send(@Body() input: NodeSendDto) {
    return this.nodeService.send(input);
  }
}
