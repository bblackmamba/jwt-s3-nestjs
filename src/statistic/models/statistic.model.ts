import { ApiProperty } from '@nestjs/swagger';
import {
  Column, Model, Table, DataType, ForeignKey, BelongsTo,
} from 'sequelize-typescript';
import User from '../../user/models/user.model';

export interface StatisticCreationAttrs {
  date: Date;
  userId: number;
}

@Table({ tableName: 'statistics' })
export default class Statistic extends Model<Statistic, StatisticCreationAttrs> {
  @ApiProperty()
  @Column({
    type: DataType.INTEGER, unique: true, primaryKey: true, autoIncrement: true,
  })
    id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
    userId: number;

  @ApiProperty()
  @Column({ type: DataType.DATE, allowNull: false })
    date: Date;

  @ApiProperty()
  @Column({ type: DataType.DATE, allowNull: false })
    createdAt: Date;

  @ApiProperty()
  @Column({ type: DataType.DATE, allowNull: false })
    updatedAt: Date;

  @BelongsTo(() => User, { foreignKey: 'userId' })
    user: User;
}
