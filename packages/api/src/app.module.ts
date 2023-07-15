import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule } from './config/config.module';
import { DatabaseService } from './database/database.service';
import { RoutesModule } from './routes/routes.module';
import { SessionModule } from './session/session.module';

@Module({
  imports: [
    ConfigModule,
    SessionModule,
    TypeOrmModule.forRootAsync({
      useClass: DatabaseService,
    }),
    ,
    RoutesModule,
  ],
})
export class AppModule {}
