import {
  ForbiddenException, Injectable, InternalServerErrorException, UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Op } from 'sequelize';
import { AuthRequest } from '../../common/dto';
import JwtPayload from '../../token/dto/jwt-payload.dto';
import Token from '../../token/models/token.model';
import User, { PROTECTED_ATTRIBUTES } from '../../user/models/user.model';
import Role from '../../role/models/role.model';

@Injectable()
export default class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: (request: AuthRequest) => {
        const fromAuthHeaderAsBearerToken = ExtractJwt.fromAuthHeaderAsBearerToken();
        this.jwt = fromAuthHeaderAsBearerToken(request);
        return this.jwt;
      },
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }

  logoutUrl = `${process.env.GLOBAL_PREFIX}/auth/logout`;

  // eslint-disable-next-line class-methods-use-this
  async validate(request: AuthRequest, payload: JwtPayload) {
    const token = await Token.findOne({
      where: {
        userId: payload.id,
        accessToken: this.jwt,
        accessExpires: { [Op.gte]: Date.now() },
        revoke: false,
      },
    });

    if (!token) {
      throw new UnauthorizedException('Invalid authorization');
    }

    const user: User = await User.findByPk(
      payload.id,
      {
        include: [
          Role,
        ],
      },
    );
    if (!user) {
      throw new InternalServerErrorException('Internal server error');
    }

    if (request.url !== this.logoutUrl) {
      throw new ForbiddenException('User banned');
    }

    user.toJSON = () => {
      const attributes = { ...user.get() };
      PROTECTED_ATTRIBUTES.forEach((attr) => {
        delete attributes[attr];
      });
      return attributes;
    };

    request.currentUser = user;

    return payload;
  }
}
