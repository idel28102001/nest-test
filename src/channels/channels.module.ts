import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelsEntity } from './entities/channels.entitiy';
import { ChannelService } from './services/channel.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChannelsEntity])],
  providers: [ChannelService],
  exports: [ChannelService]
})
export class ChannelsModule {}
