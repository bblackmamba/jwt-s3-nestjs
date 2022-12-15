import { HttpStatus, HttpException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export default class ErrorWhileDeletingFileException extends HttpException {
  static statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR;

  static message: string = 'Error while deleting file';

  @ApiProperty({ required: true, example: ErrorWhileDeletingFileException.statusCode })
    statusCode: number = ErrorWhileDeletingFileException.statusCode;

  @ApiProperty({ required: true, example: ErrorWhileDeletingFileException.message })
    message: string = ErrorWhileDeletingFileException.message;

  constructor() {
    super(ErrorWhileDeletingFileException.message, ErrorWhileDeletingFileException.statusCode);
  }
}
