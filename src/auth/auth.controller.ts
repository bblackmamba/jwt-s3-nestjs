import {
  Body, HttpCode, HttpStatus, Post, UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import AuthService from './auth.service';
import AccessTokenGuard from '../common/guards/access-token.guard';
import { DefaultController, GetToken, Public } from '../common/decorators';
import { StatusDto } from '../common/dto';
import { CreateUserDto } from '../user/dto';
import { AuthPayloadDto, LoginDto, CheckAccessDto } from './dto';
import { TokenDto, TokensDto } from '../token/dto';
import { UnauthorizedException } from '../common/exceptions';
import { UserExistsException, IncorrectAuthException } from './exceptions';
import { TokenNotFoundException } from '../token/exceptions';

@DefaultController('auth')
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiOperation({ description: 'Login' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully authorized',
    type: AuthPayloadDto,
  })
  @ApiResponse({
    status: IncorrectAuthException.statusCode,
    description: IncorrectAuthException.message,
    type: IncorrectAuthException,
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(
    @Body() userDto: LoginDto,
  ): Promise<AuthPayloadDto> {
    return this.authService.login(userDto);
  }

  @Public()
  @ApiOperation({ description: 'Registration' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully created user',
    type: AuthPayloadDto,
  })
  @ApiResponse({
    status: UserExistsException.statusCode,
    description: UserExistsException.message,
    type: UserExistsException,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  signup(@Body() userDto: CreateUserDto): Promise<AuthPayloadDto> {
    return this.authService.signup(userDto);
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ description: 'Logout' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful logout',
    type: AuthPayloadDto,
  })
  @ApiResponse({
    status: UserExistsException.statusCode,
    description: UserExistsException.message,
    type: UserExistsException,
  })
  @ApiResponse({
    status: UnauthorizedException.statusCode,
    description: UnauthorizedException.message,
    type: UnauthorizedException,
  })
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@GetToken() token: string): Promise<StatusDto> {
    return this.authService.logout({ token });
  }

  @Public()
  @ApiOperation({ description: 'Token refresh' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful refresh',
    type: TokensDto,
  })
  @ApiResponse({
    status: TokenNotFoundException.statusCode,
    description: TokenNotFoundException.message,
    type: TokenNotFoundException,
  })
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  refreshTokens(@Body() tokenDto: TokenDto): Promise<TokensDto> {
    return this.authService.refreshTokens(tokenDto);
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Post('check-access')
  checkAccess(@Body() checkAccessDto: CheckAccessDto): Promise<StatusDto> {
    return this.authService.checkAccess(checkAccessDto);
  }
}
