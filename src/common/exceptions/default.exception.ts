import { HttpStatus, HttpException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export default class DefaultException extends HttpException {
  static statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR;

  static message: string = 'Internal Server Error';

  @ApiProperty({ required: true, example: DefaultException.statusCode })
    statusCode: number = DefaultException.statusCode;

  @ApiProperty({ required: true, example: DefaultException.message })
    message: string = DefaultException.message;

  constructor() {
    super(DefaultException.message, DefaultException.statusCode);
  }
}
