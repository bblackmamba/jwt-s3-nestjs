import { forwardRef, Module } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import AuthController from './auth.controller';
import AuthService from './auth.service';
import AccessTokenStrategy from './strategies/access-token.strategy';
import TokenModule from '../token/token.module';
import UserModule from '../user/user.module';
import { Token } from '../common/models';

@Module({
  imports: [
    forwardRef(() => TokenModule),
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenStrategy,
    {
      provide: getModelToken(Token),
      useValue: Token,
    },
  ],
})

export default class AuthModule {}
