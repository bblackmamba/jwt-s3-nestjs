import {
  Column, Model, Table, DataType, ForeignKey, BelongsTo,
} from 'sequelize-typescript';
// eslint-disable-next-line import/no-cycle
import User from './user.model';

@Table({ tableName: 'coaches_has_clients' })
export default class CoachClient extends Model<CoachClient> {
  @Column({
    type: DataType.INTEGER, unique: true, primaryKey: true, autoIncrement: true,
  })
    id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
    coachId: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
    clientId: number;

  @BelongsTo(() => User, { foreignKey: 'coachId' })
    coach: User;

  @BelongsTo(() => User, { foreignKey: 'clientId' })
    client: User;
}
