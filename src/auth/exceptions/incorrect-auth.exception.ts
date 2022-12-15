import { HttpStatus, HttpException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export default class IncorrectAuthException extends HttpException {
  static statusCode: number = HttpStatus.UNPROCESSABLE_ENTITY;

  static message: string = 'Incorrect email or password';

  @ApiProperty({ required: true, example: IncorrectAuthException.statusCode })
    statusCode: number = IncorrectAuthException.statusCode;

  @ApiProperty({ required: true, example: IncorrectAuthException.message })
    message: string = IncorrectAuthException.message;

  constructor() {
    super(IncorrectAuthException.message, IncorrectAuthException.statusCode);
  }
}
