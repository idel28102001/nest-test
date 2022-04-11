import { forwardRef, Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from 'src/posts/posts.module';

import { TelegramEntity } from './entities/telegram.entity';

import { TelegramService } from './services/telegram.service';
import { TelegramUpdate } from './update/telegram.update';


@Module({
  imports: [TypeOrmModule.forFeature([TelegramEntity]), forwardRef(() => PostsModule)],

  providers: [TelegramService, TelegramUpdate],

  exports: [TelegramService],
})
export class TelegramModule {}
