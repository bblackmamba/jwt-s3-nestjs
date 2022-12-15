import { Module } from '@nestjs/common';
import { getModelToken, SequelizeModule } from '@nestjs/sequelize';
import ExerciseController from './exercise.controller';
import ExerciseService from './exercise.service';
import Exercise from './models/exercise.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Exercise]),
  ],
  controllers: [ExerciseController],
  providers: [
    ExerciseService,
    {
      provide: getModelToken(Exercise),
      useValue: Exercise,
    },
  ],
})
export default class ExerciseModule {}
