import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/auth.guard';
import { AuthModule } from './auth/auth.module';
import { JwtStrategy } from './auth/jwt.strategy';
import { UsersModule } from './users/users.module';

import { MailerModule } from '@nestjs-modules/mailer';
import { constants } from './config/constants';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    MongooseModule.forRoot(constants.mongodb.uri as string),
    MailerModule.forRoot({
      transport: {
        host: constants.smtp.host,
        port: constants.smtp.port,
        auth: {
          user: constants.smtp.username,
          pass: constants.smtp.password,
        },
      },
    }),
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
