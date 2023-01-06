import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CrudService } from '@huebot-common/services/crud.service';

import { NodeChannelEntity } from './node-channel.entity';

@Injectable()
export class NodeChannelEntityService extends CrudService<NodeChannelEntity> {
  constructor(
    @InjectRepository(NodeChannelEntity)
    protected readonly repository: Repository<NodeChannelEntity>
  ) {
    super();
  }
}
