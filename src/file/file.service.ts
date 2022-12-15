import { Inject, Injectable } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import FileRepository from './repositories/file.repository';

@Injectable()
export default class FileService {
  constructor(
    @Inject(getModelToken(FileRepository))
    private fileRepository: typeof FileRepository,
  ) {}
}
