import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegramEntity } from './entities/telegram.entity';
import { AppUpdate } from './update/telegram.update';
import { TelegramService } from './services/telegram.service';
import { NewsService } from 'src/news/services/news.service';
import { PostsEntity } from 'src/news/entities/posts.entity';
import { ContentEntity } from 'src/news/entities/content.entity';
import { UsersService } from 'src/users/services/users.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { RolesEntity } from 'src/users/entities/roles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TelegramEntity, PostsEntity, ContentEntity, UserEntity, RolesEntity])],
  providers: [AppUpdate, TelegramService, NewsService, UsersService],

})
export class TelegramModule { }
