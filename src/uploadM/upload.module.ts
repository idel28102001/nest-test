import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadFileEntity } from './entities/upload-file.entity';
import { UploadPostEntity } from './entities/upload-post.entity';
import { UploadChannelService } from './services/upload-channel.service';
import { PostsUploadService } from '../posts/services/posts-upload.service';
import { UploadService } from './services/upload.service';

@Module({
  imports: [TypeOrmModule.forFeature([UploadPostEntity, UploadFileEntity])],
  providers: [UploadService, PostsUploadService, UploadChannelService],
  exports: [UploadService, PostsUploadService, UploadChannelService],
})
export class UploadModule {}
