import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import Token, { TokenCreationAttrs } from './models/token.model';
import User from '../user/models/user.model';
import {
  GenerateTokensDto, JwtPayloadDto, TokenDto, TokensDto,
} from './dto';
import { DefaultException, UnauthorizedException } from '../common/exceptions';
import { TokenNotFoundException } from './exceptions';

@Injectable()
export default class TokenService {
  constructor(
    @Inject(getModelToken(Token))
    private tokenRepository: typeof Token,
    @Inject(getModelToken(User))
    private userRepository: typeof User,
    private jwtService: JwtService,
  ) {}

  async generateToken(tokensDto: GenerateTokensDto): Promise<TokensDto> {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(tokensDto.jwtPayload, {
          secret: process.env.ACCESS_TOKEN_SECRET,
          expiresIn: `${process.env.ACCESS_TOKEN_LIVE}m`,
        }),
        this.jwtService.signAsync(tokensDto.jwtPayload, {
          secret: process.env.REFRESH_TOKEN_SECRET,
          expiresIn: `${process.env.REFRESH_TOKEN_LIVE}m`,
        }),
      ]);

      const maxAgeAccess = new Date();
      maxAgeAccess.setMinutes(maxAgeAccess.getMinutes() + Number(process.env.ACCESS_TOKEN_LIVE));

      const maxAgeRefresh = new Date();
      maxAgeRefresh.setMinutes(maxAgeRefresh.getMinutes() + Number(process.env.REFRESH_TOKEN_LIVE));

      const tokenCreationAttrs: TokenCreationAttrs = {
        accessToken,
        refreshToken,
        userId: tokensDto.jwtPayload.id,
        sessionId: tokensDto.sessionId,
        accessExpires: maxAgeAccess,
        refreshExpires: maxAgeRefresh,
      };

      await this.tokenRepository.create<Token>(tokenCreationAttrs);

      return {
        accessToken,
        refreshToken,
      };
    } catch (err) {
      throw new DefaultException();
    }
  }

  async refreshTokens(tokenDto: TokenDto): Promise<TokensDto> {
    try {
      const payload = this.jwtService.decode(tokenDto.token) as JwtPayloadDto;

      if (!payload) {
        throw new TokenNotFoundException();
      }

      const token: Token = await this.tokenRepository.findOne({
        where: {
          refreshToken: tokenDto.token,
          refreshExpires: { [Op.gte]: Date.now() },
          revoke: false,
        },
      });
      if (!token) {
        throw new TokenNotFoundException();
      }

      const user = await this.userRepository.findByPk(token.userId);
      if (!user) {
        throw new TokenNotFoundException();
      }

      const decode = await this.jwtService.verify(
        tokenDto.token,
        { secret: process.env.REFRESH_TOKEN_SECRET },
      );

      if (decode.id !== token.userId) {
        throw new Error();
      }

      const tokensDto = await this.generateToken({
        sessionId: token.sessionId,
        jwtPayload: { id: user.id, email: user.email },
      });

      return tokensDto;
    } catch (err) {
      if (err instanceof TokenNotFoundException) {
        throw err;
      }
      throw new DefaultException();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async revokeTokensByAccessToken(tokenDto: TokenDto) {
    try {
      const token: Token = await this.tokenRepository.findOne({
        where: {
          accessToken: tokenDto.token,
          revoke: false,
        },
      });
      if (!token) {
        throw new UnauthorizedException();
      }
      await this.tokenRepository.update(
        { revoke: true },
        { where: { revoke: false, sessionId: token.sessionId } },
      );

      return { status: true };
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      throw new DefaultException();
    }
  }
}
