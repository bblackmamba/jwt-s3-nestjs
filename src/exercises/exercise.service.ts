import { Inject, Injectable } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import Exercise from './models/exercise.model';

@Injectable()
export default class ExerciseService {
  constructor(
    @Inject(getModelToken(Exercise))
    private exerciseRepository: typeof Exercise,
  ) {}
}
