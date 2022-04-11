import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { PostsEntity } from '../entities/posts.entity';
import { UploadDto } from '../../upload/dto/upload.dto';
import * as fs from 'fs';
import { TelegramService } from 'src/telegram/services/telegram.service';
import { Context } from 'vm';
import { Context as Ctx } from 'telegraf';
import { UsersService } from 'src/users/services/users.service';
import { PostDto } from '../dto/post.dto';
import { UploadEntity } from 'src/upload/entities/upload.entity';
import { UploadService } from 'src/upload/services/upload.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsEntity)
    private readonly postsRepository: Repository<PostsEntity>,
    private readonly telegramService: TelegramService,
    private readonly uploadService: UploadService,
    private readonly usersService: UsersService,
  ) {

  }


  async makePost(postDto: PostDto, uploadDto: UploadDto[], userId: string) {
    const user = await this.usersService.findById(userId, { relations: ['posts'], select: ['posts', 'id'] });
    const post = await this.createPost(postDto, uploadDto);
    user.posts.push(post);
    const result = await this.usersService.save(user);
    const lastPost = result.posts.slice(-1)[0];
    await this.sendMessage(postDto, lastPost.id);
    return lastPost;
  }

  async createPost(postDto: PostDto, uploadDto: UploadDto[]) {
    const post = this.postsRepository.create(postDto);
    post.uploads = await this.createUploads(uploadDto);
    return post;
  }

  async sendMessage(post: PostDto, postId: string) {
    const allId = await this.telegramService.getAllUsersTelegamId();
    await this.telegramService.sendAllUsers(allId, post, postId);
  }

  async createUploads(uploadDto: UploadDto[]): Promise<UploadEntity[]> {
    const allUploads = [];
    await Promise.all(
      uploadDto.map(async (e) => {
        const response = this.createContent(e);
        allUploads.push(response);
        this.saveInFolder(response.source, response.dir, e.buffer);
        return response;
      }),
    );
    return allUploads;
  }

  createContent(content: UploadDto) {
    const response = this.uploadService.create(content);
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
    const post = await this.getPostById(postId, { relations: ['uploads'] });
    await this.sendMedias(ctx, post.uploads);
    await ctx.reply(post.description);
    await ctx.replyWithPoll('Как вам пост?', ['Нравится', 'Не нравится', 'Посмотреть результаты'], { allows_multiple_answers: false, is_anonymous: true, });
  }


  async sendMedias(ctx: Context, content: UploadEntity[]) {
    await Promise.all(this.createMediaPromises(ctx, content));
  }

  createMediaPromises(ctx: Context, content: UploadEntity[]) {
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
