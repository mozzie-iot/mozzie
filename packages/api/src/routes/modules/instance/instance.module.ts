import { Module } from '@nestjs/common';

//
import { NativeClientModule } from '@huebot-api/native-client/native-client.module';
import { NodeEntityModule } from '@huebot-hub-core/common';

import { InstanceResolver } from './instance.resolver';
import { InstanceService } from './instance.service';

@Module({
  imports: [NativeClientModule, NodeEntityModule],
  providers: [InstanceService, InstanceResolver],
})
export class InstanceModule {}
