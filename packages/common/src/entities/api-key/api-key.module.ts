import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApiKeyEntity } from './api-key.entity';
import { ApiKeyEntityService } from './api-key.service';

@Module({
  imports: [TypeOrmModule.forFeature([ApiKeyEntity])],
  providers: [ApiKeyEntityService],
  exports: [ApiKeyEntityService],
})
export class ApiKeyEntityModule {}
