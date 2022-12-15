import { Module } from '@nestjs/common';
import { getModelToken, SequelizeModule } from '@nestjs/sequelize';
import UserController from './user.controller';
import User from './models/user.model';
import Role from '../role/models/role.model';
import FileRepository from '../file/repositories/file.repository';
// eslint-disable-next-line import/no-named-as-default
import UserService from './user.service';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: getModelToken(User),
      useValue: User,
    },
    {
      provide: getModelToken(Role),
      useValue: Role,
    },
    {
      provide: getModelToken(FileRepository),
      useValue: FileRepository,
    },
  ],
  exports: [UserService],
})

export default class UserModule {}
