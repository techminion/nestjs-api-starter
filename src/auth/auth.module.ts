import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

import { ConfigModule } from '@nestjs/config';
import { constants } from 'src/config/constants';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    JwtModule.register({
      secret: constants.jwt.secret,
      signOptions: {
        expiresIn: constants.jwt.expire,
      },
    }),
    PassportModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
