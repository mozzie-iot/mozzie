import { Module } from '@nestjs/common';

import { NativeClientModule } from '@huebot-api/native-client/native-client.module';

import { InstanceResolver } from './instance.resolver';
import { InstanceService } from './instance.service';

@Module({
  imports: [NativeClientModule],
  providers: [InstanceService, InstanceResolver],
})
export class InstanceModule {}
