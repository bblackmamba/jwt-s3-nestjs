import {
  Column, Model, Table, DataType, ForeignKey, BelongsTo,
} from 'sequelize-typescript';
// eslint-disable-next-line import/no-cycle
import User from '../../user/models/user.model';
import Achievement from './achievement.model';

@Table({ tableName: 'users_has_achievements' })
export default class AchievementUser extends Model<AchievementUser> {
  @Column({
    type: DataType.INTEGER, unique: true, primaryKey: true, autoIncrement: true,
  })
    id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
    userId: number;

  @ForeignKey(() => Achievement)
  @Column({ type: DataType.INTEGER, allowNull: false })
    achievementId: number;

  @BelongsTo(() => User, { foreignKey: 'userId' })
    user: User;

  @BelongsTo(() => Achievement, { foreignKey: 'achievementId' })
    achievement: User;
}
