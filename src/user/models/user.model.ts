import { ApiProperty } from '@nestjs/swagger';
import {
  Column, Model, Table, DataType, HasMany, ForeignKey, BelongsTo, BelongsToMany,
} from 'sequelize-typescript';
// eslint-disable-next-line import/no-cycle
import Token from '../../token/models/token.model';
import Role from '../../role/models/role.model';
// eslint-disable-next-line import/no-cycle
import CoachClient from './coache-client.model';

export interface UserCreationAttrs {
  roleId: number;
  email: string;
  password: string;
  name: string;
  avatar: string,
}

export const PROTECTED_ATTRIBUTES: Array<string> = [
  'passwordHash',
  'deletedAt',
];

@Table({ tableName: 'users' })
export default class User extends Model<User, UserCreationAttrs> {
  @ApiProperty()
  @Column({
    type: DataType.INTEGER, unique: true, primaryKey: true, autoIncrement: true,
  })
    id: number;

  @ApiProperty()
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
    email: string;

  @Column({ type: DataType.STRING, allowNull: true })
    passwordHash: string;

  @ApiProperty()
  @Column({ type: DataType.STRING, allowNull: false })
    name: string;

  @ApiProperty()
  @Column({ type: DataType.STRING, allowNull: true })
    avatar: string;

  @HasMany(() => Token)
    tokens: Token[];

  @Column({ type: DataType.DATE, allowNull: true })
    deletedAt: Date;

  @ApiProperty()
  @Column({ type: DataType.DATE, allowNull: false })
    createdAt: Date;

  @ApiProperty()
  @Column({ type: DataType.DATE, allowNull: false })
    updatedAt: Date;

  @ForeignKey(() => Role)
  @Column({ type: DataType.INTEGER, allowNull: false })
    roleId: number;

  @BelongsTo(() => Role)
    role: Role;

  @BelongsToMany(
    () => User,
    { through: () => CoachClient, as: 'clientId', foreignKey: 'id' },
  )
    coaches: User[];

  @BelongsToMany(
    () => User,
    { through: () => CoachClient, as: 'coachId', foreignKey: 'id' },
  )
    clients: User[];

  toJSON(): object {
    const attributes = { ...this.get() };
    PROTECTED_ATTRIBUTES.forEach((attr) => {
      delete attributes[attr];
    });
    return attributes;
  }
}
