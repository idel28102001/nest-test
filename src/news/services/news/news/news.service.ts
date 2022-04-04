import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NewsDto } from 'src/news/dto/News.dto';
import { NewsEntity } from 'src/typeorm';
import { userIdTypes } from 'src/users/types/userId.types';
import { Repository } from 'typeorm';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(NewsEntity)
    private readonly newsRepository: Repository<NewsEntity>,
  ) {}

  async createPost(dto: NewsDto, user: userIdTypes) {
    const post = Object.assign(dto, user);
    const newPost = await this.newsRepository.save(
      post as unknown as NewsEntity,
    );
    newPost.owner = true;
    return newPost;
  }

  async findPostById(id: number, userId: string) {
    const post = await this.newsRepository.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException();
    }
    post.owner = post.userId === parseInt(userId);
    return post;
  }

  async getAllPosts(userId: string) {
    const posts = await this.newsRepository.find();
    posts.map((e) => {
      e.owner = e.userId === parseInt(userId);
    });
    return posts;
  }

  async deletePost(id: number, userId: string) {
    const post = await this.findPostById(id, userId);
    if (post) {
      if (post.owner) {
        const result = await this.newsRepository.delete(post.id);
        return result;
      }
    }
  }
}
