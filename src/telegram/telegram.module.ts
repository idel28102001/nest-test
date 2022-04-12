import { forwardRef, Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from 'src/posts/posts.module';
import { UsersModule } from 'src/users/users.module';
import { TelegramController } from './controllers/telegram.controller';

import { TelegramEntity } from './entities/telegram.entity';
import { TelegramAuthService } from './services/telegram.auth.service';

import { TelegramService } from './services/telegram.service';
import { TelegramUpdate } from './update/telegram.update';


@Module({
  imports: [TypeOrmModule.forFeature([TelegramEntity]), forwardRef(() => PostsModule), forwardRef(() => UsersModule)],

  providers: [TelegramService, TelegramUpdate, TelegramAuthService],

  exports: [TelegramService, TelegramAuthService],

  controllers: [TelegramController],
})
export class TelegramModule {}
