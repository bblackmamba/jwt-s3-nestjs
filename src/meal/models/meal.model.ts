import { ApiProperty } from '@nestjs/swagger';
import {
  Column, Model, Table, DataType,
} from 'sequelize-typescript';

export interface MealCreationAttrs {
  name: string;
  calories: number,
  weight: number,
  pfc: string,
}

@Table({ tableName: 'meals' })
export default class Meal extends Model<Meal, MealCreationAttrs> {
  @ApiProperty()
  @Column({
    type: DataType.INTEGER, unique: true, primaryKey: true, autoIncrement: true,
  })
    id: number;

  @ApiProperty()
  @Column({ type: DataType.STRING, allowNull: false })
    name: string;

  @ApiProperty()
  @Column({ type: DataType.NUMBER, allowNull: false })
    calories: number;

  @ApiProperty()
  @Column({ type: DataType.NUMBER, allowNull: false })
    weight: number;

  @ApiProperty()
  @Column({ type: DataType.STRING, allowNull: false })
    pfc: string;

  @ApiProperty()
  @Column({ type: DataType.DATE, allowNull: false })
    createdAt: Date;

  @ApiProperty()
  @Column({ type: DataType.DATE, allowNull: false })
    updatedAt: Date;
}
