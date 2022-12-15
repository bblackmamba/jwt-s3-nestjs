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

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: Number(process.env.POSTGRES_PORT) || 5432,
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'root',
      database: process.env.POSTGRES_DB || 'nest-course',
      autoLoadModels: true,
      synchronize: true,
      omitNull: true,
    }),
    UserModule,
    AchievementModule,
    MealModule,
    ExerciseModule,
    ArticleModule,
    StatisticModule,
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
