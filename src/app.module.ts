import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { UsersController } from './users/controllers/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { config } from './common/config';
import { TelegramModule } from './telegram/telegram.module';
import { TelegrafModule } from 'nestjs-telegraf';
import { RolesModule } from './roles/roles.module';
import { ContentsModule } from './contents/contents.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({ useFactory: () => config.getDatabaseOptions() }),
    UsersModule,
    AuthModule,
    PostsModule,
    TelegrafModule.forRoot({
      token: config.telegramToken(),
    }),
    TelegramModule,
    RolesModule,
    ContentsModule,
  ],
  controllers: [UsersController],
  exports: [],
})
export class AppModule { }
