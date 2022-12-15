import { ApiProperty } from '@nestjs/swagger';
import User from '../models/user.model';
import Role from '../../role/models/role.model';

export default class UserWithRoleDto extends User {
  @ApiProperty({ type: () => Role })
    role: Role;
}
