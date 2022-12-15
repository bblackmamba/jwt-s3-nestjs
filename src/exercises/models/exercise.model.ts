import { ApiProperty } from '@nestjs/swagger';
import {
  Column, Model, Table, DataType,
} from 'sequelize-typescript';

export interface ExerciseCreationAttrs {
  title: string;
  content: string;
}

@Table({ tableName: 'exercises' })
export default class Exercise extends Model<Exercise, ExerciseCreationAttrs> {
  @ApiProperty()
  @Column({
    type: DataType.INTEGER, unique: true, primaryKey: true, autoIncrement: true,
  })
    id: number;

  @ApiProperty()
  @Column({ type: DataType.STRING, allowNull: false })
    title: string;

  @ApiProperty()
  @Column({ type: DataType.STRING, allowNull: false })
    content: string;

  @ApiProperty()
  @Column({ type: DataType.DATE, allowNull: false })
    createdAt: Date;

  @ApiProperty()
  @Column({ type: DataType.DATE, allowNull: false })
    updatedAt: Date;
}
