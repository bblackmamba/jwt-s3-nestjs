import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import User from '../user/models/user.model';
import RolesEnum from '../role/enums/roles.enum';
import Article from '../article/models/article.model';
import Achievement from '../achievment/models/achievement.model';
import Exercise from '../exercises/models/exercise.model';
import Meal from '../meal/models/meal.model';
import Statistic from '../statistic/models/statistic.model';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
  Join = 'join',
  Close = 'close',
  Like = 'like',
  Comment = 'comment',
  Repost = 'repost',
}

type Subjects = InferSubjects<
  typeof User
| typeof Article
| typeof Achievement
| typeof Exercise
| typeof Meal
| typeof Statistic
> | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  // eslint-disable-next-line class-methods-use-this
  createForUser(user: User): AppAbility {
    const { can, build } = new AbilityBuilder<
    Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    // Superadmin
    if (user.role.name === RolesEnum.Admin) {
      can(Action.Manage, 'all');
    }

    // Admin
    if (user.role.name === RolesEnum.Coach) {
      can(Action.Manage, User);
      can(Action.Manage, Article);
      can(Action.Manage, Achievement);
      can(Action.Manage, Exercise);
      can(Action.Manage, Meal);
      can(Action.Manage, Statistic);
    }

    return build({
      detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
