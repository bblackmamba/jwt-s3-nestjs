import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { APP_GUARD } from '@nestjs/core';
import ArticleModule from './article/article.module';
import StatisticModule from './statistic/statistic.module';
import ExerciseModule from './exercises/exercise.module';
import MealModule from './meal/meal.module';
import AchievementModule from './achievment/achievement.module';
import UserModule from './user/user.module';
import AccessTokenGuard from './common/guards/access-token.guard';
import RolesGuard from './common/guards/roles.guard';
import CaslModule from './casl/casl.module';
import TokenModule from './token/token.module';
import RoleModule from './role/role.module';
import AuthModule from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      autoLoadModels: true,
      synchronize: true,
      omitNull: true,
    }),
    UserModule,
    AchievementModule,
    MealModule,
    TokenModule,
    RoleModule,
    AuthModule,
    ExerciseModule,
    ArticleModule,
    StatisticModule,
    CaslModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export default class AppModule {}
