import { ApiProperty } from '@nestjs/swagger';
import {
  Column, Model, Table, DataType,
} from 'sequelize-typescript';
import RolesEnum from '../enums/roles.enum';

interface RoleCreationAttrs {
  name: string;
}

const PROTECTED_ATTRIBUTES: Array<string> = [
  'createdAt',
  'updatedAt',
];

@Table({ tableName: 'roles' })
export default class Role extends Model<Role, RoleCreationAttrs> {
  @ApiProperty()
  @Column({
    type: DataType.INTEGER, unique: true, primaryKey: true, autoIncrement: true,
  })
    id: number;

  @ApiProperty()
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
    name: RolesEnum;

  @Column({ type: DataType.DATE, allowNull: false })
    createdAt: Date;

  @Column({ type: DataType.DATE, allowNull: false })
    updatedAt: Date;

  toJSON(): object {
    const attributes = { ...this.get() };
    PROTECTED_ATTRIBUTES.forEach((attr) => {
      delete attributes[attr];
    });
    return attributes;
  }
}
