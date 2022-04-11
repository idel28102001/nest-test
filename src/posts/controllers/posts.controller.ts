import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { GetUser, UserPayload } from 'src/auth/decorators/get-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { PostDto } from 'src/posts/dto/post.dto';
import { PostsService } from 'src/posts/services/posts.service';
import { UploadDto } from 'src/upload/dto/upload.dto';
import { Role } from 'src/users/enums/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('post')
export class PostsController {
  constructor(private readonly newsService: PostsService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  @Roles(Role.ADMIN)
  async createPost(
    @UploadedFiles() content: Array<UploadDto>,
    @Body() dto: PostDto,
    @GetUser() user: UserPayload,
  ) {
    const { userId } = user;
    return await this.newsService.makePost(
      dto, content,
      userId,
    );
  }
  @Get(':id')
  @Roles(Role.ADMIN)
  async findPost(@Param('id', ParseUUIDPipe) id: string) {
    return await this.newsService.getPostById(id);
  }

  @Get()
  @Roles(Role.ADMIN)
  async getAllPosts() {
    return await this.newsService.getAllPosts();
  }
  @Delete(':id')
  @Roles(Role.ADMIN)
  async deletePost(@Param('id', ParseUUIDPipe) id: string) {
    return await this.newsService.deletePost(id);
  }
}
