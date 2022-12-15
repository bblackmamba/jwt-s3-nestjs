import { ApiProperty } from '@nestjs/swagger';
import {
  Column, Model, Table, DataType, BelongsToMany,
} from 'sequelize-typescript';
import FileTypeEnum from '../enums/file-type.enum';
import Article from '../../article/models/article.model';
// eslint-disable-next-line import/no-cycle
import FileArticle from './file-article.model';
import Exercise from '../../exercises/models/exercise.model';
// eslint-disable-next-line import/no-cycle
import FileExercise from './file-exercise.model';
import Meal from '../../meal/models/meal.model';
// eslint-disable-next-line import/no-cycle
import FileMeal from './file-meal.model';

interface FileCreationAttrs {
  name: string;
  type: FileTypeEnum,
  path: string,
  size: number,
  extension: string
  index: number,
  title?: string,
  description?: string,
  banner?: string,
  layers?: string,
}

const PROTECTED_ATTRIBUTES: Array<string> = [
  'FileEvent',
  'FilePublication',
];

@Table({ tableName: 'files' })
export default class File extends Model<File, FileCreationAttrs> {
  @ApiProperty()
  @Column({
    type: DataType.INTEGER, unique: true, primaryKey: true, autoIncrement: true,
  })
    id: number;

  @ApiProperty()
  @Column({ type: DataType.STRING, allowNull: true })
    name: string;

  @ApiProperty()
  @Column({ type: DataType.STRING, allowNull: true })
    path: string;

  @ApiProperty()
  @Column({ type: DataType.STRING, allowNull: false })
    extension: string;

  @ApiProperty()
  @Column({ type: DataType.FLOAT, allowNull: false })
    size: number;

  @ApiProperty()
  @Column({ type: DataType.ENUM(...Object.values(FileTypeEnum)), allowNull: false })
    type: FileTypeEnum;

  @ApiProperty()
  @Column({ type: DataType.TEXT, allowNull: true })
    layers: string;

  @ApiProperty()
  @Column({ type: DataType.INTEGER, allowNull: false })
    index: number;

  @ApiProperty()
  @Column({ type: DataType.STRING, allowNull: true })
    title: string;

  @ApiProperty()
  @Column({ type: DataType.STRING, allowNull: true })
    description: string;

  @ApiProperty()
  @Column({ type: DataType.STRING, allowNull: true })
    banner: string;

  @ApiProperty()
  @Column({ type: DataType.FLOAT, allowNull: true })
    duration: number;

  @BelongsToMany(() => Meal, () => FileMeal)
    publications: Meal[];

  @BelongsToMany(() => Exercise, () => FileExercise)
    exercises: Exercise[];

  @BelongsToMany(() => Article, () => FileArticle)
    articles: Article[];

  toJSON(): object {
    const attributes = { ...this.get() };
    PROTECTED_ATTRIBUTES.forEach((attr) => {
      delete attributes[attr];
    });
    return attributes;
  }
}
