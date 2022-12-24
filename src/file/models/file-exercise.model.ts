import {
  Column, Model, Table, DataType, ForeignKey,
} from 'sequelize-typescript';
// eslint-disable-next-line import/no-cycle
import File from './file.model';
import Exercise from '../../exercises/models/exercise.model';

@Table({ tableName: 'exercises_has_files' })
export default class FileExercise extends Model<FileExercise> {
  @Column({
    type: DataType.INTEGER, unique: true, primaryKey: true, autoIncrement: true,
  })
    id: number;

  @ForeignKey(() => Exercise)
  @Column({ type: DataType.INTEGER, allowNull: false })
    exerciseId: number;

  @ForeignKey(() => File)
  @Column({ type: DataType.INTEGER, allowNull: false })
    fileId: number;
}
