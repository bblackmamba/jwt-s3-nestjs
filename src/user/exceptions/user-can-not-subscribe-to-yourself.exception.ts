import { HttpStatus, HttpException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export default class UserCanNotCoachToYourselfException extends HttpException {
  static statusCode: number = HttpStatus.UNPROCESSABLE_ENTITY;

  static message: string = 'User can not coach to yourself';

  @ApiProperty({ required: true, example: UserCanNotCoachToYourselfException.statusCode })
    statusCode: number = UserCanNotCoachToYourselfException.statusCode;

  @ApiProperty({ required: true, example: UserCanNotCoachToYourselfException.message })
    message: string = UserCanNotCoachToYourselfException.message;

  constructor() {
    super(
      UserCanNotCoachToYourselfException.message,
      UserCanNotCoachToYourselfException.statusCode,
    );
  }
}
