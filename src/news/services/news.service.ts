import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/services/users.service';
import { Repository } from 'typeorm';
import { ContentEntity } from '../entities/content.entity';
import { PostsEntity } from '../entities/posts.entity';
import { postInterface } from '../interfaces/post.interface';
import { Telegraf, Markup } from 'telegraf';
import { config } from 'src/common/config';
import { TelegramEntity } from 'src/telegram/entities/telegram.entity';
import { ContentDto } from '../dto/content.dto';
import * as fs from 'fs';

@Injectable()
export class NewsService {
  private app = new Telegraf(config.telegramToken());
  constructor(
    @InjectRepository(PostsEntity)
    private readonly postsRepository: Repository<PostsEntity>,
    @InjectRepository(ContentEntity)
    private readonly contentRepository: Repository<ContentEntity>,
    @InjectRepository(TelegramEntity)
    private readonly telegramRepository: Repository<TelegramEntity>,
    private readonly userServices: UsersService,
  ) {

  }


  async createPost(dto: postInterface, userId: string) {
    const { content, ...post } = dto;
    const currentPost = { ...post, userId };
    const { id: postId } = await this.postsRepository.save(currentPost);
    await this.createContents(content, postId);
    await this.sendMessage(dto, postId);

    return { postId };
  }

  async sendMessage(post: postInterface, postId: string) {
    const allId = (await this.telegramRepository.find()).map(e => e.telegramId);
    await this.sendAllUsers(allId, post, postId);
  }

  async sendAllUsers(users: number[], post: postInterface, postId: string) {
    await Promise.all(users.map(e => this.app.telegram.sendMessage(e, `<b>${post.title}</b>\n${post.announcement}`, {
      parse_mode: 'HTML', ...Markup.inlineKeyboard([
        Markup.button.callback('Читать полностью...', `Read-(${postId})`),
      ])
    })));
  }

  async getPostById(postId: string) {
    const post = await this.postsRepository.findOne({ where: { id: postId } });
    const content = await this.contentRepository.find({ where: { postId } });
    return {
      content, ...post
    };
  }

  async createContents(content: ContentDto[], postId: string) {
    await this.validateContent(content);
    await Promise.all(
      content.map((e) => this.contentRepository.save({ ...e, postId })),
    );
  }

  createFolder(src: string) {
    if (!fs.existsSync(src)) {
      fs.mkdirSync(src);
    }
  }

  async validateContent(content: ContentDto[]) {
    this.createFolder('upload');
    content.map(e => {
      if (e.mimetype.split('/')[0] === 'video') {
        const path = `upload/${e.originalname}`;
        fs.writeFileSync(path, e.buffer);
        e.buffer = null;
        e.source = path;
      }
    });
  }

  async findPostById(id: string) {
    const post = await this.postsRepository.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException();
    }
    return post;
  }

  async getAllPosts() {
    const posts = await this.postsRepository.find();
    return posts;
  }

  async deletePost(id: string) {
    const post = await this.findPostById(id);
    if (post) {
      if (post.userId === id) {
        const result = await this.postsRepository.delete(post.id);
        return result;
      }
    }
  }
}
