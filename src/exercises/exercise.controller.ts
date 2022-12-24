import { Controller } from '@nestjs/common';
import ExerciseService from './exercise.service';

@Controller('exercises')
export default class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}
}
