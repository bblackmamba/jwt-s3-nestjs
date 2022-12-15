import { Module } from '@nestjs/common';
import MealController from './meal.controller';

@Module({
  controllers: [MealController],
})
export default class MealModule {}
