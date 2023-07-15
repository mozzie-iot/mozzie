import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ApiKeyEntity } from '@huebot/common';
import { DatabaseCrudService } from '@huebot/database/database-crud.service';

import { ApiKeyCreateDto } from './dto/create.dto';

@Injectable()
export class ApiKeyService extends DatabaseCrudService<ApiKeyEntity> {
  constructor(
    @InjectRepository(ApiKeyEntity)
    protected readonly repository: Repository<ApiKeyEntity>,
  ) {
    super();
  }

  public async create(input: ApiKeyCreateDto) {
    const api_key = new ApiKeyEntity();
    api_key.nickname = input.nickname;
    api_key.role = input.role;
    await this.repository.save(api_key);
    return api_key;
  }
}
