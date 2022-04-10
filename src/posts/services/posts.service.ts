import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { PostsEntity } from '../entities/posts.entity';
import { postInterface } from '../interfaces/post.interface';
import { Telegraf, Markup } from 'telegraf';
import { config } from 'src/common/config';
import { ContentDto } from '../dto/content.dto';
import * as fs from 'fs';
import { TelegramService } from 'src/telegram/services/telegram.service';
import { Context } from 'vm';
import { Context as Ctx } from 'telegraf';
import { UsersService } from 'src/users/services/users.service';
import { ContentEntity } from '../entities/content.entity';
import { ContentsService } from './contents.service';

@Injectable()
export class PostsService {
  private app = new Telegraf(config.telegramToken());
  constructor(
    @InjectRepository(PostsEntity)
    private readonly postsRepository: Repository<PostsEntity>,
    private readonly telegramService: TelegramService,
    private readonly contentsService: ContentsService,
    private readonly usersService: UsersService,
  ) {

  }


  async makePost(dto: postInterface, userId: string) {
    const user = await this.usersService.findById(userId, { relations: ['posts'], select: ['posts', 'id'] });
    const post = await this.createPost(dto);
    user.posts.push(post);
    const result = await this.usersService.save(user);
    const lastPost = result.posts.slice(-1)[0];
    await this.sendMessage(dto, lastPost.id);
    return lastPost;
  }

  async createPost(dto: postInterface) {
    const { content, ...postData } = dto;
    const post = this.postsRepository.create(postData);
    const contents = await this.createContents(content);
    post.contents = contents;
    return post;
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

  async createContents(contents: ContentDto[]) {
    const allContents = [];
    await Promise.all(
      contents.map(async (e) => {
        const response = this.createContent(e);
        allContents.push(response);
        this.saveInFolder(response.source, response.dir, e.buffer);
        return response;
      }),
    );
    return allContents;
  }

  createContent(content: ContentDto) {
    const response = this.contentsService.create(content);
    response.mimetype = response.mimetype.split('/')[0];
    response.dir = `upload/${response.mimetype}`;
    response.source = `${response.dir}/${response.originalname}`;
    return response;
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

  checkUuid(id: string) {
    const pattern = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
    return pattern.test(id);
  }

  async getPostById(id?: string, options?: FindOneOptions<PostsEntity>) {
    if (this.checkUuid(id)) {
      return await this.postsRepository.findOne(id, options);;
    } else {
      throw new NotFoundException();
    }
  }

  async getAllPosts() {
    return await this.postsRepository.find();
  }
  async deletePost(id: string) {
    return await this.postsRepository.delete(id);
  }

  async sendMessageToTGUser(ctx: Ctx, postId: string) {
    const post = await this.getPostById(postId, { relations: ['contents'] });
    await this.sendMedias(ctx, post.contents);
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
