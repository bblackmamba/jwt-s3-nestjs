import { ApiProperty } from '@nestjs/swagger';
import {
  Column, Model, Table, DataType,
} from 'sequelize-typescript';
import { AchievementTypeEnum } from '../enums';

export interface AchievementCreationAttrs {
  name: string;
  type: AchievementTypeEnum;
}

@Table({ tableName: 'achievements' })
export default class Achievement extends Model<Achievement, AchievementCreationAttrs> {
  @ApiProperty()
  @Column({
    type: DataType.INTEGER, unique: true, primaryKey: true, autoIncrement: true,
  })
    id: number;

  @ApiProperty()
  @Column({ type: DataType.STRING, allowNull: false })
    name: string;

  @ApiProperty()
  @Column({ type: DataType.STRING, allowNull: false })
    type: AchievementTypeEnum;

  @ApiProperty()
  @Column({ type: DataType.DATE, allowNull: false })
    createdAt: Date;

  @ApiProperty()
  @Column({ type: DataType.DATE, allowNull: false })
    updatedAt: Date;
}
