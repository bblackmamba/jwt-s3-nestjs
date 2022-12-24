import { ApiProperty } from '@nestjs/swagger';

export default class UserIdDto {
  @ApiProperty()
    id: string;
}
