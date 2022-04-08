import { Module } from '@nestjs/common';
import { PostsService } from './services/posts.service';
import { PostsController } from './controllers/posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsEntity } from './entities/posts.entity';
import { ContentsModule } from 'src/contents/contents.module';
import { TelegramModule } from 'src/telegram/telegram.module';
import { PostUpdate } from './update/post.update';

@Module({
  imports: [

    TypeOrmModule.forFeature([PostsEntity]), ContentsModule, TelegramModule
  ],
  providers: [PostsService, PostUpdate],
  controllers: [PostsController],
  exports: [PostsService],
})
export class PostsModule { }
