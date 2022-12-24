import { HttpStatus, HttpException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export default class UserExistsException extends HttpException {
  static statusCode: number = HttpStatus.UNPROCESSABLE_ENTITY;

  static message: string = 'User with this email exists';

  @ApiProperty({ required: true, example: UserExistsException.statusCode })
    statusCode: number = UserExistsException.statusCode;

  @ApiProperty({ required: true, example: UserExistsException.message })
    message: string = UserExistsException.message;

  constructor() {
    super(UserExistsException.message, UserExistsException.statusCode);
  }
}
