import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegramModule } from 'src/telegram/telegram.module';
import { UploadModule } from 'src/upload/upload.module';
import { UsersModule } from 'src/users/users.module';
import { ChannelsEntity } from './entities/channels.entitiy';
import { ChannelService } from './services/channel.service';
import { ChannelRepService } from './services/channel-rep.service';
import { ChannelController } from './controllers/channels.controller';
import { PostsModule } from 'src/posts/posts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChannelsEntity]),
    TelegramModule,
    UsersModule,
    UploadModule,
    PostsModule
  ],
  providers: [ChannelService, ChannelRepService],
  exports: [ChannelService, ChannelRepService],
  controllers: [ChannelController],
})
export class ChannelsModule {}
