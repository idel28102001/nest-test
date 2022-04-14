import { forwardRef, Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelsModule } from 'src/channels/channels.module';
import { PostsModule } from 'src/posts/posts.module';
import { UploadModule } from 'src/uploadM/upload.module';
import { UsersModule } from 'src/users/users.module';

import { TelegramEntity } from './entities/telegram.entity';
import { TelegramAuthService } from './services/telegram-auth.service';
import { TelegramMessagesService } from './services/telegram-messages.service';
import { TelegramService } from './services/telegram.service';
import { TelegramChannelService } from './services/telegramm-channel.service';
//import { TelegramUpdate } from './update/telegram.update';


@Module({
  imports: [
    TypeOrmModule.forFeature([TelegramEntity]),
    UsersModule,
  ],

  providers: [
    TelegramService,
    TelegramAuthService,
    TelegramChannelService,
    TelegramMessagesService
  ],
  exports: [
    TelegramService,
    TelegramAuthService,
    TelegramChannelService,
    TelegramMessagesService
  ],

  controllers: [],
})
export class TelegramModule {}
