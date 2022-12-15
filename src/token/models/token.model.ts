import { ApiProperty } from '@nestjs/swagger';
import {
  Column, Model, Table, DataType, ForeignKey, BelongsTo,
} from 'sequelize-typescript';
// eslint-disable-next-line import/no-cycle
import User from '../../user/models/user.model';

export interface TokenCreationAttrs {
  userId: number;
  sessionId: string;
  accessToken: string;
  refreshToken: string;
  accessExpires: Date;
  refreshExpires: Date;
}

@Table({ tableName: 'tokens' })
export default class Token extends Model<Token, TokenCreationAttrs> {
  @ApiProperty()
  @Column({
    type: DataType.INTEGER, unique: true, primaryKey: true, autoIncrement: true,
  })
    id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, unique: true, allowNull: false })
    userId: number;

  @ApiProperty()
  @Column({ type: DataType.STRING, allowNull: false })
    sessionId: string;

  @ApiProperty()
  @Column({ type: DataType.STRING, allowNull: false })
    accessToken: string;

  @ApiProperty()
  @Column({ type: DataType.STRING, allowNull: false })
    refreshToken: string;

  @ApiProperty()
  @Column({ type: DataType.DATE, allowNull: false })
    accessExpires: Date;

  @ApiProperty()
  @Column({ type: DataType.DATE, allowNull: false })
    refreshExpires: Date;

  @ApiProperty()
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
    revoke: boolean;

  @BelongsTo(() => User)
    user: User;
}
