import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadFileEntity } from './entities/upload-file.entity';
import { UploadChannelService } from './services/upload-channel.service';
import { UploadService } from './services/upload.service';

@Module({
  imports: [TypeOrmModule.forFeature([UploadFileEntity])],
  providers: [UploadService, UploadChannelService],
  exports: [UploadService, UploadChannelService],
})
export class UploadModule {}
