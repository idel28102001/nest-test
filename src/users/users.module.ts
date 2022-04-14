import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { ValidateService } from './services/validate.service';
import { TelegramModule } from 'src/telegram/telegram.module';
import { PostsModule } from 'src/posts/posts.module';
import { ChannelsModule } from 'src/channels/channels.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [UsersController],
  providers: [UsersService, ValidateService],
  exports: [UsersService, ValidateService],
})
export class UsersModule {}
