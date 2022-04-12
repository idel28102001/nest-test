import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadEntity } from './entities/upload.entity';
import { UploadService } from './services/upload.service';

@Module({
  imports: [TypeOrmModule.forFeature([UploadEntity])],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
