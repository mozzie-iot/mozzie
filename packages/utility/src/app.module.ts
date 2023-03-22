import { Module } from '@nestjs/common';

import { ConfigModule, TypeOrmModule } from '@huebot-hub-core/common';

import { GqlModule } from './graphql/graphql.module';
import { StatusModule } from './routes/modules/status/status.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      api_key: undefined,
      secret_key: undefined,
      mqtt_username: undefined,
      mqtt_password: undefined,
    }),
    GqlModule,
    TypeOrmModule,
    StatusModule,
  ],
})
export class AppModule {}
