import { Module } from '@nestjs/common';

import { ApiKeyEntityModule } from '@huebot/common';

import { ApiKeyController } from './api-key.controller';
import { ApiKeyService } from './api-key.service';

@Module({
  imports: [ApiKeyEntityModule],
  providers: [ApiKeyService],
  controllers: [ApiKeyController],
})
export class ApiKeyModule {}
