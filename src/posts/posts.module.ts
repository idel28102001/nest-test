import { Module } from '@nestjs/common';
import { PostsService } from './services/posts.service';
import { PostsController } from './controllers/posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsEntity } from './entities/posts.entity';
import { TelegramModule } from 'src/telegram/telegram.module';
import { PostUpdate } from './update/post.update';
import { UsersModule } from 'src/users/users.module';
import { ContentEntity } from './entities/content.entity';
import { ContentsService } from './services/contents.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostsEntity, ContentEntity]),
    TelegramModule,
    UsersModule,
  ],
  providers: [PostsService, PostUpdate, ContentsService],
  controllers: [PostsController],
  exports: [PostsService, ContentsService],
})
export class PostsModule { }
