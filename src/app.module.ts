import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/auth.guard';
import { JwtStrategy } from './auth/jwt.strategy';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { constants } from './config/configuration';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    MongooseModule.forRoot(constants.mongodb.uri as string),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    JwtStrategy,
  ],
})
export class AppModule {}
