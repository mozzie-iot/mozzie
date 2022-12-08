import { Module } from '@nestjs/common';

import { NativeClientModule } from '@huebot-api/native-client/native-client.module';
import { ConfigEntityModule } from '@huebot-hub-core/common';

import { InstanceService } from './instance.service';

@Module({
  imports: [NativeClientModule, ConfigEntityModule],
  providers: [InstanceService],
})
export class InstanceModule {}
