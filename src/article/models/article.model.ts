import { ApiProperty } from '@nestjs/swagger';
import {
  Column, Model, Table, DataType, ForeignKey,
} from 'sequelize-typescript';
import User from '../../user/models/user.model';

export interface ArticleCreationAttrs {
  title: string;
  description: string;
  meta: string;
  status: string;
  coachId: number;
}

@Table({ tableName: 'articles' })
export default class Article extends Model<Article, ArticleCreationAttrs> {
  @ApiProperty()
  @Column({
    type: DataType.INTEGER, unique: true, primaryKey: true, autoIncrement: true,
  })
    id: number;

  @ApiProperty()
  @Column({ type: DataType.STRING, allowNull: false })
    title: string;

  @ApiProperty()
  @Column({ type: DataType.TEXT, allowNull: false })
    description: string;

  @ApiProperty()
  @Column({ type: DataType.TEXT, allowNull: false })
    meta: string;

  @ApiProperty()
  @Column({ type: DataType.TEXT, allowNull: false })
    status: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
    coachId: number;

  @ApiProperty()
  @Column({ type: DataType.DATE, allowNull: false })
    createdAt: Date;

  @ApiProperty()
  @Column({ type: DataType.DATE, allowNull: false })
    updatedAt: Date;
}
