import { HttpStatus, HttpException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export default class RoleNotFoundException extends HttpException {
  static statusCode: number = HttpStatus.NOT_FOUND;

  static message: string = 'Role not found';

  @ApiProperty({ required: true, example: RoleNotFoundException.statusCode })
    statusCode: number = RoleNotFoundException.statusCode;

  @ApiProperty({ required: true, example: RoleNotFoundException.message })
    message: string = RoleNotFoundException.message;

  constructor() {
    super(RoleNotFoundException.message, RoleNotFoundException.statusCode);
  }
}
