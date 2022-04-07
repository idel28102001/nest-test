import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { ContentEntity } from 'src/news/entities/content.entity';
import { PostsEntity } from 'src/news/entities/posts.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, PostsEntity, ContentEntity])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule { }
