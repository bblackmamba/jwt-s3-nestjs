import { HttpStatus, HttpException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export default class TokenNotFoundException extends HttpException {
  static statusCode: number = HttpStatus.NOT_FOUND;

  static message: string = 'Token not found';

  @ApiProperty({ required: true, example: TokenNotFoundException.statusCode })
    statusCode: number = TokenNotFoundException.statusCode;

  @ApiProperty({ required: true, example: TokenNotFoundException.message })
    message: string = TokenNotFoundException.message;

  constructor() {
    super(TokenNotFoundException.message, TokenNotFoundException.statusCode);
  }
}
