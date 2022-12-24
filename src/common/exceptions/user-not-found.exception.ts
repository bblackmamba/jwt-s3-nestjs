import { HttpStatus, HttpException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export default class UserNotFoundException extends HttpException {
  static statusCode: number = HttpStatus.NOT_FOUND;

  static message: string = 'User not found';

  @ApiProperty({ required: true, example: UserNotFoundException.statusCode })
    statusCode: number = UserNotFoundException.statusCode;

  @ApiProperty({ required: true, example: UserNotFoundException.message })
    message: string = UserNotFoundException.message;

  constructor() {
    super(UserNotFoundException.message, UserNotFoundException.statusCode);
  }
}
