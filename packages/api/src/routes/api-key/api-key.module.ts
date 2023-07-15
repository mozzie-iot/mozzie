import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApiKeyEntity } from '@huebot/common';

import { ApiKeyController } from './api-key.controller';
import { ApiKeyService } from './api-key.service';

@Module({
  imports: [TypeOrmModule.forFeature([ApiKeyEntity])],
  providers: [ApiKeyService],
  controllers: [ApiKeyController],
})
export class ApiKeyModule {}
