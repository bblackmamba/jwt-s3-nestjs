import { Module } from '@nestjs/common';
import { getModelToken, SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import TokenService from './token.service';
import Token from './models/token.model';
import User from '../user/models/user.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Token]),
    JwtModule.register({}),
  ],
  providers: [
    TokenService,
    {
      provide: getModelToken(Token),
      useValue: Token,
    },
    {
      provide: getModelToken(User),
      useValue: User,
    },
  ],
  exports: [TokenService],
})

export default class TokenModule {}
