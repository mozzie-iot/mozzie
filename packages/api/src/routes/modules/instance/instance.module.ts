import { Module } from '@nestjs/common';

import { NativeClientModule } from '@huebot-api/native-client/native-client.module';

import { InstanceService } from './instance.service';

@Module({
  imports: [NativeClientModule],
  providers: [InstanceService],
})
export class InstanceModule {}
