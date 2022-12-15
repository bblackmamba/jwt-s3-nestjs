import { Module } from '@nestjs/common';
import AchievementController from './achievement.controller';

@Module({
  controllers: [AchievementController],
})
export default class AchievementModule {}
