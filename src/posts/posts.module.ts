import { forwardRef, Module } from '@nestjs/common';
import { PostsService } from './services/posts.service';
import { PostsController } from './controllers/posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsEntity } from './entities/posts.entity';
import { TelegramModule } from 'src/telegram/telegram.module';
import { UsersModule } from 'src/users/users.module';
import { UploadModule } from 'src/uploadM/upload.module';
import { ChannelsModule } from 'src/channels/channels.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostsEntity]),
    TelegramModule,
    //forwardRef(() => UsersModule),
    ChannelsModule,
    UploadModule
  ],
  providers: [PostsService],
  controllers: [PostsController],
  exports: [PostsService],
})
export class PostsModule { }
