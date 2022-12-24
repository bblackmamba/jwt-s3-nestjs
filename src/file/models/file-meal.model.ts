import {
  Column, Model, Table, DataType, ForeignKey,
} from 'sequelize-typescript';
// eslint-disable-next-line import/no-cycle
import File from './file.model';
import Meal from '../../meal/models/meal.model';

@Table({ tableName: 'events_has_files' })
export default class FileMeal extends Model<FileMeal> {
  @Column({
    type: DataType.INTEGER, unique: true, primaryKey: true, autoIncrement: true,
  })
    id: number;

  @ForeignKey(() => Meal)
  @Column({ type: DataType.INTEGER, allowNull: false })
    mealId: number;

  @ForeignKey(() => File)
  @Column({ type: DataType.INTEGER, allowNull: false })
    fileId: number;
}
