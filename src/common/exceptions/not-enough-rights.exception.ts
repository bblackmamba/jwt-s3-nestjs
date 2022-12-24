import { HttpStatus, HttpException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export default class NotEnoughRightsException extends HttpException {
  static statusCode: number = HttpStatus.FORBIDDEN;

  static message: string = 'Not enough rights';

  @ApiProperty({ required: true, example: NotEnoughRightsException.statusCode })
    statusCode: number = NotEnoughRightsException.statusCode;

  @ApiProperty({ required: true, example: NotEnoughRightsException.message })
    message: string = NotEnoughRightsException.message;

  constructor() {
    super(NotEnoughRightsException.message, NotEnoughRightsException.statusCode);
  }
}
