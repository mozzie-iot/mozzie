import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';

import { AdminModule } from './admin/admin.module';
import { AdminUserModule } from './admin/user/user.module';
import { CoreModule } from './core/core.module';
import { NodeModule } from './core/node/node.module';
import { UserModule } from './core/user/user.module';

@Module({
  imports: [
    CoreModule,
    AdminModule,
    RouterModule.register([
      {
        path: 'core',
        module: CoreModule,
        children: [
          {
            path: 'user',
            module: UserModule,
          },
          {
            path: 'node',
            module: NodeModule,
          },
        ],
      },
      {
        path: 'admin',
        module: AdminModule,
        children: [
          {
            path: 'user',
            module: AdminUserModule,
          },
        ],
      },
    ]),
  ],
})
export class RoutesModule {}
