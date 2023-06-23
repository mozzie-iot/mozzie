import { Injectable } from '@nestjs/common';

import { ApiKeyEntityService, ApiKeyEntity } from '@huebot/common';

import { ApiKeyCreateDto } from './dto/create.dto';

@Injectable()
export class ApiKeyService {
  constructor(private apiKeyService: ApiKeyEntityService) {}

  public async create(input: ApiKeyCreateDto) {
    const api_key = new ApiKeyEntity();
    api_key.nickname = input.nickname;
    api_key.role = input.role;
    await this.apiKeyService.save(api_key);
    return api_key;
  }
}
