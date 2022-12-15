import { applyDecorators, Controller } from '@nestjs/common';
import { ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import {
  DefaultException, UnauthorizedException, BadRequestException, NotEnoughRightsException,
} from '../exceptions';

const AuthController = (prefix: string | string[]) => applyDecorators(
  Controller(prefix) as PropertyDecorator,
  ApiBearerAuth() as PropertyDecorator,
  ApiResponse({
    status: DefaultException.statusCode,
    description: DefaultException.message,
    type: DefaultException,
  }) as PropertyDecorator,
  ApiResponse({
    status: UnauthorizedException.statusCode,
    description: UnauthorizedException.message,
    type: UnauthorizedException,
  }) as PropertyDecorator,
  ApiResponse({
    status: BadRequestException.statusCode,
    description: BadRequestException.message,
    type: BadRequestException,
  }) as PropertyDecorator,
  ApiResponse({
    status: NotEnoughRightsException.statusCode,
    description: NotEnoughRightsException.message,
    type: NotEnoughRightsException,
  }) as PropertyDecorator,

);

export default AuthController;
