import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { NewsDto } from 'src/news/dto/News.dto';
import { NewsService } from 'src/news/services/news/news/news.service';
import { userIdTypes } from 'src/users/types/userId.types';

@Controller('news')
@UseGuards(JwtAuthGuard)
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post('create-post')
  @UsePipes(ValidationPipe)
  async createPost(@Body() dto: NewsDto, @Req() req: Request) {
    return await this.newsService.createPost(
      dto,
      req.user as unknown as userIdTypes,
    );
  }

  @Get(':id')
  async findPost(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const { userId } = req.user as unknown as userIdTypes;
    return await this.newsService.findPostById(id, userId);
  }

  @Get()
  async getAllPosts(@Req() req: Request) {
    const { userId } = req.user as unknown as userIdTypes;
    return await this.newsService.getAllPosts(userId);
  }

  @Delete(':id')
  async deletePost(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const { userId } = req.user as unknown as userIdTypes;
    return await this.newsService.deletePost(id, userId);
  }
}
