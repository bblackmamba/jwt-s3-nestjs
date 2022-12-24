import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { getModelToken } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import UserService from '../user/user.service';
import TokenService from '../token/token.service';
import RolesEnum from '../role/enums/roles.enum';
import ADMIN_ROLES from '../role/consts/admin-roles.const';
import User, { PROTECTED_ATTRIBUTES } from '../user/models/user.model';
import { AuthPayloadDto, LoginDto } from './dto';
import { TokenDto, TokensDto } from '../token/dto';
import { CreateUserDto } from '../user/dto';
import { StatusDto } from '../common/dto';
import {
  DefaultException,
  UnauthorizedException,
  UserNotFoundException,
} from '../common/exceptions';
import { TokenNotFoundException } from '../token/exceptions';
import { IncorrectAuthException, UserExistsException } from './exceptions';
import { randomStr } from '../common/utils';
import Role from '../role/models/role.model';
import { Token } from '../common/models';

@Injectable()
export default class AuthService {
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    @Inject(getModelToken(Token))
    private tokenRepository: typeof Token,
  ) {}

  async login(
    userDto: LoginDto,
  ): Promise<AuthPayloadDto> {
    try {
      const user = await this.validateUser(userDto);

      const sessionId = randomStr(30);

      const tokens = await this.tokenService.generateToken({
        sessionId,
        jwtPayload: { id: user.id, email: user.email },
      });

      if (!ADMIN_ROLES.includes(user.role.name as RolesEnum)) {
        this.tokenRepository.update(
          {
            revoke: true,
          },
          {
            where: {
              userId: user.id,
              revoke: false,
              sessionId: {
                [Op.ne]: sessionId,
              },
            },
          },
        );
      }

      user.toJSON = () => {
        const attributes = { ...user.get() };
        PROTECTED_ATTRIBUTES.forEach((attr) => {
          delete attributes[attr];
        });
        return attributes;
      };

      return {
        user,
        ...tokens,
      };
    } catch (err) {
      if (err instanceof IncorrectAuthException) {
        throw err;
      }
      if (err instanceof UserNotFoundException) {
        throw err;
      }
      throw new DefaultException();
    }
  }

  async signup(userDto: CreateUserDto): Promise<AuthPayloadDto> {
    try {
      const candidate = await this.userService.findByEmail(userDto.email);
      if (candidate) {
        throw new UserExistsException();
      }
      const user = await this.userService.createUser(userDto);

      const tokens = await this.tokenService.generateToken({
        sessionId: randomStr(30),
        jwtPayload: { id: user.id, email: user.email },
      });

      return {
        user,
        ...tokens,
      };
    } catch (err) {
      if (err instanceof IncorrectAuthException) {
        throw err;
      }
      if (err instanceof UserExistsException) {
        throw err;
      }
      throw new DefaultException();
    }
  }

  async logout(token: TokenDto): Promise<StatusDto> {
    try {
      const result = await this.tokenService.revokeTokensByAccessToken(token);

      return result;
    } catch (err) {
      if (err instanceof IncorrectAuthException) {
        throw err;
      }
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      throw new DefaultException();
    }
  }

  async refreshTokens(token: TokenDto): Promise<TokensDto> {
    try {
      const result = await this.tokenService.refreshTokens(token);

      return result;
    } catch (err) {
      if (err instanceof TokenNotFoundException) {
        throw err;
      }
      throw new DefaultException();
    }
  }

  private async validateUser(userDto: LoginDto): Promise<User> {
    const user = await this.userService.findByEmail(
      userDto.email,
      [Role],
    );
    if (!user || !(user instanceof User)) {
      throw new IncorrectAuthException();
    }
    const passwordEquals = await bcrypt.compare(userDto.password, user.passwordHash);
    if (!passwordEquals) {
      throw new IncorrectAuthException();
    }
    return user;
  }
}
