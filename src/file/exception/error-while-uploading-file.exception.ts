import { HttpStatus, HttpException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export default class ErrorWhileUploadingFileException extends HttpException {
  static statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR;

  static message: string = 'Error while uploading file';

  @ApiProperty({ required: true, example: ErrorWhileUploadingFileException.statusCode })
    statusCode: number = ErrorWhileUploadingFileException.statusCode;

  @ApiProperty({ required: true, example: ErrorWhileUploadingFileException.message })
    message: string = ErrorWhileUploadingFileException.message;

  constructor() {
    super(ErrorWhileUploadingFileException.message, ErrorWhileUploadingFileException.statusCode);
  }
}
