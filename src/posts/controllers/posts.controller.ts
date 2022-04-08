import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { GetUser, UserPayload } from 'src/auth/decorators/get-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { NewsDto } from 'src/posts/dto/post.dto';
import { PostsService } from 'src/posts/services/posts.service';
import { ContentDto } from '../dto/content.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('news')
export class PostsController {
  constructor(private readonly newsService: PostsService) { }

  @Post('post')
  @UseInterceptors(FilesInterceptor('files'))
  @Roles(Role.Admin)
  async createPost(
    @UploadedFiles() content: Array<ContentDto>,
    @Body() dto: NewsDto,
    @GetUser() user: UserPayload,
  ) {
    const { userId } = user;
    return await this.newsService.createPost(
      { ...dto, content },
      userId,
    );
  }
  @Get(':id')
  @Roles(Role.Admin)
  async findPost(@Param('id', ParseIntPipe) id: string) {
    return await this.newsService.findPostById(id);
  }

  @Get()
  @Roles(Role.Admin)
  async getAllPosts() {
    return await this.newsService.getAllPosts();
  }
  @Delete(':id')
  @Roles(Role.Admin)
  async deletePost(@Param('id', ParseIntPipe) id: string) {
    return await this.newsService.deletePost(id);
  }
}