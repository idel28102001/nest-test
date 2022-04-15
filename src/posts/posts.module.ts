import { Module } from '@nestjs/common';
import { PostsController } from './controllers/posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegramModule } from 'src/telegram/telegram.module';
import { UploadModule } from 'src/upload/upload.module';
import { PostsChannelEntity } from './entities/posts-channel.entity';
import { PostsChannelService } from './services/posts-channel.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostsChannelEntity]),
    TelegramModule,
    UploadModule
  ],
  providers: [PostsChannelService],
  controllers: [PostsController],
  exports: [PostsChannelService],
})
export class PostsModule {}
