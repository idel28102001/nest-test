import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelPhotoEntity } from './entities/channel-photo.entity';
import { PostUploadEntity } from './entities/post-upload.entity';
import { UploadChannelService } from './services/upload-channel.service';
import { UploadPostService } from '../posts/services/upload-post.service';
import { UploadService } from './services/upload.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostUploadEntity, ChannelPhotoEntity])],
  providers: [UploadService, UploadPostService, UploadChannelService],
  exports: [UploadService, UploadPostService, UploadChannelService],
})
export class UploadModule {}
