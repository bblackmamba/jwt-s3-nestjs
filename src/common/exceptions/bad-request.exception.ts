import { HttpStatus, HttpException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export default class BadRequestException extends HttpException {
  static statusCode: number = HttpStatus.BAD_REQUEST;

  static message: string = 'Bad Request';

  @ApiProperty({ required: true, example: BadRequestException.statusCode })
    statusCode: number = BadRequestException.statusCode;

  @ApiProperty({ required: true, example: BadRequestException.message })
    message: string = BadRequestException.message;

  @ApiProperty({ required: true, example: [BadRequestException.message] })
    errors: string[] = [BadRequestException.message];

  constructor(objectOrError, description = BadRequestException.message) {
    super(BadRequestException.createBody(
      objectOrError,
      description,
      HttpStatus.BAD_REQUEST,
    ), HttpStatus.BAD_REQUEST);
  }

  static createBody(objectOrError, description, statusCode) {
    if (!objectOrError) {
      return { statusCode, message: description };
    }
    return { statusCode, message: description, errors: objectOrError };
  }
}
