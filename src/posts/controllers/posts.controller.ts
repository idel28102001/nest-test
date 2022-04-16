import {
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Role } from 'src/users/enums/role.enum';
import { PostsChannelService } from '../services/posts-channel.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('post')
export class PostsController {
  constructor(private readonly postsChannelService: PostsChannelService) {}

  @Get(':id')
  @Roles(Role.ADMIN)
  async findPost(@Param('id', ParseUUIDPipe) id: string) {
    return await this.postsChannelService.getPostById(id);
  }

  @Get()
  @Roles(Role.ADMIN)
  async getAllPosts() {
    return await this.postsChannelService.getAllPosts();
  }
  @Delete(':id')
  @Roles(Role.ADMIN)
  async deletePost(@Param('id', ParseUUIDPipe) id: string) {
    return await this.postsChannelService.deletePost(id);
  }
}
