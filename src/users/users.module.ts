import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { ContentEntity } from 'src/news/entities/content.entity';
import { PostsEntity } from 'src/news/entities/posts.entity';
import { RolesEntity } from './entities/roles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, PostsEntity, ContentEntity, RolesEntity])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule { }
