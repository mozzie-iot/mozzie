import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CrudService } from '@huebot-common/services/crud.service';

import { NodeEntity } from './node.entity';

@Injectable()
export class NodeEntityService extends CrudService<NodeEntity> {
  constructor(
    @InjectRepository(NodeEntity)
    protected readonly repository: Repository<NodeEntity>
  ) {
    super();
  }
}
