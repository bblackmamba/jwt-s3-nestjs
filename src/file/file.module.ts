import { Module } from '@nestjs/common';
import { getModelToken, SequelizeModule } from '@nestjs/sequelize';
import FileController from './file.controller';
import File from './models/file.model';
import FileService from './file.service';
import FileArticle from './models/file-article.model';
import FileExercise from './models/file-exercise.model';
import FileMeal from './models/file-meal.model';
import FileRepository from './repositories/file.repository';

@Module({
  imports: [
    SequelizeModule.forFeature([File, FileArticle, FileExercise, FileMeal]),
  ],
  providers: [
    FileService,
    {
      provide: getModelToken(FileRepository),
      useValue: FileRepository,
    },
  ],
  exports: [FileService],
  controllers: [FileController],
})
export default class FileModule {}
