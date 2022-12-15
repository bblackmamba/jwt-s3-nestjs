import { ApiProperty } from '@nestjs/swagger';
import UserWithRoleDto from './user-with-role.dto';

export default class UsersDto {
  @ApiProperty({ type: [UserWithRoleDto] })
    rows: UserWithRoleDto[];

  @ApiProperty({ example: '1' })
    count: number;
}
