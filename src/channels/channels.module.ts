import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegramModule } from 'src/telegram/telegram.module';
import { UploadModule } from 'src/uploadM/upload.module';
import { UsersModule } from 'src/users/users.module';
import { ChannelsEntity } from './entities/channels.entitiy';
import { ChannelService } from './services/channel.service';
import { ChannelRepService } from './services/channel-rep.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChannelsEntity]),
    TelegramModule,
    UsersModule,
    UploadModule,
  ],
  providers: [ChannelService, ChannelRepService],
  exports: [ChannelService, ChannelRepService]
})
export class ChannelsModule {}
