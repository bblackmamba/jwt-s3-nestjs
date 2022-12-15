import { HttpStatus, HttpException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export default class FileNotFoundException extends HttpException {
  static statusCode: number = HttpStatus.NOT_FOUND;

  static message: string = 'File not found';

  @ApiProperty({ required: true, example: FileNotFoundException.statusCode })
    statusCode: number = FileNotFoundException.statusCode;

  @ApiProperty({ required: true, example: FileNotFoundException.message })
    message: string = FileNotFoundException.message;

  constructor() {
    super(FileNotFoundException.message, FileNotFoundException.statusCode);
  }
}
