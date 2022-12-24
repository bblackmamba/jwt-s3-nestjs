import {
  Column, Model, Table, DataType, ForeignKey,
} from 'sequelize-typescript';
// eslint-disable-next-line import/no-cycle
import File from './file.model';
import Article from '../../article/models/article.model';

@Table({ tableName: 'articles_has_files' })
export default class FileArticle extends Model<FileArticle> {
  @Column({
    type: DataType.INTEGER, unique: true, primaryKey: true, autoIncrement: true,
  })
    id: number;

  @ForeignKey(() => Article)
  @Column({ type: DataType.INTEGER, allowNull: false })
    articleId: number;

  @ForeignKey(() => File)
  @Column({ type: DataType.INTEGER, allowNull: false })
    fileId: number;
}
