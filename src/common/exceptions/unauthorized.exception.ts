import { HttpStatus, HttpException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export default class UnauthorizedException extends HttpException {
  static statusCode: number = HttpStatus.UNAUTHORIZED;

  static message: string = 'Unauthorized';

  @ApiProperty({ required: true, example: UnauthorizedException.statusCode })
    statusCode: number = UnauthorizedException.statusCode;

  @ApiProperty({ required: true, example: UnauthorizedException.message })
    message: string = UnauthorizedException.message;

  constructor() {
    super(UnauthorizedException.message, UnauthorizedException.statusCode);
  }
}
