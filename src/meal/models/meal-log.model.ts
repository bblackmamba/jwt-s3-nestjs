import { ApiProperty } from '@nestjs/swagger';
import {
  Column, Model, Table, DataType, ForeignKey, BelongsTo,
} from 'sequelize-typescript';
import Meal from './meal.model';
import Statistic from '../../statistic/models/statistic.model';

export interface MealLogCreationAttrs {
  mealId: number;
  statisticId: number;
  isEaten: boolean;
}

@Table({ tableName: 'meals_logs' })
export default class MealLog extends Model<MealLog, MealLogCreationAttrs> {
  @ApiProperty()
  @Column({
    type: DataType.INTEGER, unique: true, primaryKey: true, autoIncrement: true,
  })
    id: number;

  @ForeignKey(() => Meal)
  @Column({ type: DataType.INTEGER, allowNull: false })
    mealId: number;

  @ForeignKey(() => Statistic)
  @Column({ type: DataType.INTEGER, allowNull: false })
    statisticId: Date;

  @ApiProperty()
  @Column({ type: DataType.BOOLEAN, allowNull: false })
    isEaten: boolean;

  @ApiProperty()
  @Column({ type: DataType.DATE, allowNull: false })
    createdAt: Date;

  @ApiProperty()
  @Column({ type: DataType.DATE, allowNull: false })
    updatedAt: Date;

  @BelongsTo(() => Meal, { foreignKey: 'mealId' })
    meal: Meal;

  @BelongsTo(() => Statistic, { foreignKey: 'statisticId' })
    statistic: Statistic;
}
