import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostsEntity } from '../entities/posts.entity';
import { postInterface } from '../interfaces/post.interface';
import { Telegraf, Markup } from 'telegraf';
import { config } from 'src/common/config';
import { ContentDto } from '../dto/content.dto';
import * as fs from 'fs';
import { TelegramService } from 'src/telegram/services/telegram.service';
import { ContentsService } from 'src/contents/services/contents.service';
import { Context } from 'vm';
import { Context as Ctx } from 'telegraf';
import { ContentEntity } from 'src/contents/entities/content.entity';

@Injectable()
export class PostsService {
  private app = new Telegraf(config.telegramToken());
  constructor(
    @InjectRepository(PostsEntity)
    private readonly postsRepository: Repository<PostsEntity>,
    private readonly telegramService: TelegramService,
    private readonly contentsService: ContentsService,
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
    const allId = await this.telegramService.getAllUsersTelegamId();
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
    const content = await this.contentsService.findByPostId(postId);
    return {
      content, ...post
    };
  }

  async createContents(content: ContentDto[], postId: string) {
    await Promise.all(
      content.map(async (e) => {
        const response = await this.contentsService.save({ ...e, postId });
        this.saveInFolder(response.source, response.dir, e.buffer);
        return response;
      }),
    );
  }

  saveInFolder(src: string, dir: string, buffer: Buffer) {
    this.createFolders(dir)
    fs.writeFileSync(src, buffer);
  }

  createFolders(src: string) {
    if (!fs.existsSync('upload')) {
      fs.mkdirSync('upload')
    }

    if (!fs.existsSync(src)) {
      fs.mkdirSync(src);
    }
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

  async sendMessageToTGUser(ctx: Ctx, postId: string) {
    const post = await this.getPostById(postId);
    await this.sendMedias(ctx, post.content);
    await ctx.reply(post.description);
    await ctx.replyWithPoll('Как вам пост?', ['Нравится', 'Не нравится', 'Посмотреть результаты'], { allows_multiple_answers: false, is_anonymous: true, });
  }


  async sendMedias(ctx: Context, content: ContentEntity[]) {
    await Promise.all(this.createMediaPromises(ctx, content));
  }

  createMediaPromises(ctx: Context, content: ContentEntity[]) {
    return content.map(cnt => {
      const currType = cnt.mimetype.split('/')[0];
      switch (currType) {
        case 'image': {
          return ctx.replyWithPhoto({ source: cnt.source });
        }
        case 'audio': {
          return ctx.replyWithAudio({ source: cnt.source });
        }
        case 'video': {
          return ctx.replyWithVideo({ source: cnt.source });
        }
      }
    });
  }



}
