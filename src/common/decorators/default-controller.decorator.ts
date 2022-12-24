import { applyDecorators, Controller } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { DefaultException, BadRequestException } from '../exceptions';

const DefaultController = (prefix: string | string[]) => applyDecorators(
  Controller(prefix) as PropertyDecorator,
  ApiResponse({
    status: DefaultException.statusCode,
    description: DefaultException.message,
    type: DefaultException,
  }) as PropertyDecorator,
  ApiResponse({
    status: BadRequestException.statusCode,
    description: BadRequestException.message,
    type: BadRequestException,
  }) as PropertyDecorator,
);

export default DefaultController;
