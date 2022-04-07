import { Module } from '@nestjs/common';
import { NewsService } from './services/news.service';
import { NewsController } from './controllers/news.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { ContentEntity } from './entities/content.entity';
import { PostsEntity } from './entities/posts.entity';
import { UsersService } from 'src/users/services/users.service';
import { TelegramEntity } from 'src/telegram/entities/telegram.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostsEntity, UserEntity, ContentEntity, TelegramEntity]),
  ],
  providers: [NewsService, UsersService],
  controllers: [NewsController],
  exports: [],
})
export class NewsModule { }
