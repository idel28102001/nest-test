import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { NewsDto } from 'src/news/dto/post.dto';
import { NewsService } from 'src/news/services/news.service';
import { userIdTypes } from 'src/users/types/userId.types';

@UseGuards(JwtAuthGuard)
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) { }

  @Post('post')
  @UseInterceptors(FilesInterceptor('files'))
  @UsePipes(ValidationPipe)
  async createPost(
    @UploadedFiles() content: Array<Express.Multer.File>,
    @Body() dto: NewsDto,
    @Req() req: Request,
  ) {
    const { userId } = req.user as unknown as userIdTypes;
    return await this.newsService.createPost(
      { ...dto, content },
      userId,
    );
  }

  @Get(':id')
  async findPost(@Param('id', ParseIntPipe) id: number) {
    return await this.newsService.findPostById(id);
  }
  @Get()
  async getAllPosts() {
    return await this.newsService.getAllPosts();
  }
  @Delete(':id')
  async deletePost(@Param('id', ParseIntPipe) id: number) {
    return await this.newsService.deletePost(id);
  }
}
