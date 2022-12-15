import { Injectable, Inject } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { getModelToken } from '@nestjs/sequelize';
import { Includeable } from 'sequelize/types/model';
import { DefaultException, NotEnoughRightsException, UserNotFoundException } from '../common/exceptions';
import { RoleNotFoundException } from '../role/exceptions';
import {
  CreateUserDto,
  UpdateUserDto,
} from './dto';
import { Action, AppAbility, CaslAbilityFactory } from '../casl/casl-ability.factory';
import { IncorrectAuthException } from '../auth/exceptions';
import User, { PROTECTED_ATTRIBUTES, UserCreationAttrs } from './models/user.model';
import Role from '../role/models/role.model';
import FileRepository from '../file/repositories/file.repository';
import { StatusDto } from '../common/dto';
import ADMIN_ROLES from '../role/consts/admin-roles.const';
import RolesEnum from '../role/enums/roles.enum';
import { ErrorWhileDeletingFileException, ErrorWhileUploadingFileException } from '../file/exception';

const DEFAULT_AVATAR: string = '/files/users/default-avatar.png';

@Injectable()
export default class UserService {
  constructor(
    @Inject(getModelToken(User))
    private userRepository: typeof User,
    @Inject(getModelToken(Role))
    private roleRepository: typeof Role,
    @Inject(getModelToken(FileRepository))
    private fileRepository: typeof FileRepository,
    private abilityFactory: CaslAbilityFactory,
  ) {}

  async findByEmail(email: string, include: Includeable[] = []): Promise<User> {
    try {
      const user: User = await this.userRepository.findOne({
        where: { email, deletedAt: null },
        include,
      });
      return user;
    } catch (err) {
      throw new DefaultException();
    }
  }

  async find(
    id: number,
    currentUser: User,
  ): Promise<User> {
    try {
      const user: User = await this.userRepository.findOne({
        where: { id, deletedAt: null },
        include: [
          Role,
        ],
      });
      if (!user) {
        throw new UserNotFoundException();
      }

      const ability: AppAbility = this.abilityFactory.createForUser(currentUser);
      const hasAccess: boolean = ability.can(Action.Manage, 'all')
        || ability.can(Action.Manage, User)
        || ability.can(Action.Read, user);
      if (!hasAccess) {
        throw new NotEnoughRightsException();
      }

      if (user.id === currentUser.id || ADMIN_ROLES.includes(currentUser.role.name as RolesEnum)) {
        user.toJSON = () => {
          const attributes = { ...user.get() };
          PROTECTED_ATTRIBUTES.forEach((attr) => {
            delete attributes[attr];
          });
          return attributes;
        };
      }

      return user;
    } catch (err) {
      if (err instanceof UserNotFoundException) {
        throw err;
      }
      if (err instanceof NotEnoughRightsException) {
        throw err;
      }
      throw new DefaultException();
    }
  }

  async createUser(userDto: CreateUserDto): Promise<User> {
    try {
      const role: Role = await this.roleRepository.findOne({ where: { name: RolesEnum.User } });
      if (!role) {
        throw new RoleNotFoundException();
      }
      const hashPassword: string = await bcrypt.hash(userDto.password, 5);
      const userCreationAttrs: UserCreationAttrs = {
        ...userDto,
        password: hashPassword,
        roleId: role.id,
        avatar: DEFAULT_AVATAR,
      };
      const user: User = await this.userRepository.create(userCreationAttrs);

      const isUser: User = await this.userRepository.findByPk(user.id, { include: [Role] });
      return isUser;
    } catch (err) {
      if (err instanceof RoleNotFoundException) {
        throw err;
      }
      throw new DefaultException();
    }
  }

  async update(
    id: number,
    userDto: UpdateUserDto,
    currentUser: User,
    files: Array<Express.Multer.File>,
  ): Promise<User> {
    try {
      const user: User = await this.userRepository.findOne({
        where: { id, deletedAt: null },
      });
      if (!user) {
        throw new UserNotFoundException();
      }

      const ability: AppAbility = this.abilityFactory.createForUser(currentUser);
      const hasAccess: boolean = ability.can(Action.Manage, 'all')
          || ability.can(Action.Manage, User)
          || ability.can(Action.Update, user);
      if (!hasAccess) {
        throw new NotEnoughRightsException();
      }

      let passwordHash: string = '';
      if (userDto.password) {
        const passwordEquals: boolean = await bcrypt.compare(
          userDto.password.old,
          user.passwordHash,
        );
        if (!passwordEquals) {
          throw new IncorrectAuthException();
        }
        passwordHash = await bcrypt.hash(userDto.password.new, 5);
      }

      await this.userRepository.update({
        name: userDto.name || user.name,
        passwordHash: passwordHash || user.passwordHash,
      }, { where: { id: user.id } });

      if (user.avatar && userDto.avatar === 'delete') {
        if (user.avatar !== DEFAULT_AVATAR) {
          const result = this.fileRepository.deleteFile(user.avatar);
          if (!result) {
            throw new ErrorWhileDeletingFileException();
          }
          await this.userRepository.update({
            avatar: DEFAULT_AVATAR,
          }, { where: { id, deletedAt: null } });
        }
      }

      const avatarFile: Express.Multer.File = files
        ? files.find((file) => file.fieldname === 'avatar')
        : null;

      if (avatarFile) {
        if (user.avatar && user.avatar !== DEFAULT_AVATAR) {
          const result = this.fileRepository.deleteFile(user.avatar);
          if (!result) {
            throw new ErrorWhileDeletingFileException();
          }
          await this.userRepository.update({
            avatar: DEFAULT_AVATAR,
          }, { where: { id, deletedAt: null } });
        }
        const avatarPath = await this.fileRepository.uploadFile(user.id, {
          folder: 'users',
          attribute: 'avatar',
          file: avatarFile,
        });

        if (!avatarPath) {
          throw new ErrorWhileUploadingFileException();
        }
        await this.userRepository.update(
          { avatar: avatarPath },
          { where: { id: user.id } },
        );
      }

      const result: User = await this.userRepository.findByPk(id, {
        include: [
          Role,
        ],
      });

      // eslint-disable-next-line no-param-reassign
      user.toJSON = () => {
        const attributes = { ...user.get() };
        PROTECTED_ATTRIBUTES.forEach((attr) => {
          delete attributes[attr];
        });
        return attributes;
      };

      return result;
    } catch (err) {
      if (err instanceof UserNotFoundException) {
        throw err;
      }
      if (err instanceof IncorrectAuthException) {
        throw err;
      }
      if (err instanceof NotEnoughRightsException) {
        throw err;
      }
      throw new DefaultException();
    }
  }

  async delete(
    id: number,
    currentUser: User,
  ): Promise<StatusDto> {
    try {
      const user: User = await this.userRepository.findOne({
        where: { id, deletedAt: null },
      });
      if (!user) {
        throw new UserNotFoundException();
      }

      const ability: AppAbility = this.abilityFactory.createForUser(currentUser);
      const hasAccess: boolean = ability.can(Action.Manage, 'all')
          || ability.can(Action.Manage, User)
          || ability.can(Action.Update, user);
      if (!hasAccess) {
        throw new NotEnoughRightsException();
      }

      await this.userRepository.update({
        deletedAt: new Date(),
      }, {
        where: { id },
      });

      return { status: true };
    } catch (err) {
      if (err instanceof UserNotFoundException) {
        throw err;
      }
      if (err instanceof IncorrectAuthException) {
        throw err;
      }
      if (err instanceof NotEnoughRightsException) {
        throw err;
      }
      throw new DefaultException();
    }
  }
}
