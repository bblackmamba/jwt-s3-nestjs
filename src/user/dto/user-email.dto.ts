import { ApiProperty } from '@nestjs/swagger';

export default class UserEmailDto {
  @ApiProperty()
    email: string;
}
