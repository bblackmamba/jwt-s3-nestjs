import { ApiProperty } from '@nestjs/swagger';
import UserWithRole from '../../user/dto/user-with-role.dto';

export default class AuthPayloadDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUz....' })
    accessToken: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUz....' })
    refreshToken: string;

  @ApiProperty()
    user: UserWithRole;
}
