import { readFileSync } from 'node:fs';

import { Module } from '@nestjs/common';

import {
  ConfigModule,
  MqttCredentials,
  RedisModule,
  TypeOrmModule,
} from '@huebot-hub-core/common';

import { GqlModule } from './graphql/graphql.module';
import { RoutesModule } from './routes/routes.module';

const mqtt_credentials_raw = readFileSync('/usr/app/mqtt.json', {
  encoding: 'utf8',
  flag: 'r',
});

const mqtt_credentials = JSON.parse(mqtt_credentials_raw) as MqttCredentials;

@Module({
  imports: [
    ConfigModule.forRoot(mqtt_credentials),
    TypeOrmModule,
    RedisModule,
    GqlModule,
    RoutesModule,
  ],
})
export class AppModule { }
