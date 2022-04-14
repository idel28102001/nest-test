import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { PostsEntity } from '../entities/posts.entity';
import { UploadDto } from '../../uploadM/dto/upload.dto';
import * as fs from 'fs';
import { Context } from 'vm';
import { Context as Ctx } from 'telegraf';
import { UsersService } from 'src/users/services/users.service';
import { PostDto } from '../dto/post.dto';
import { PostUploadEntity } from 'src/uploadM/entities/post-upload.entity';
import { ChannelService } from 'src/channels/services/channel.service';
import { UploadPostService } from './upload-post.service';
import { ChannelRepService } from 'src/channels/services/channel-rep.service';
import { UserPayload } from 'src/auth/decorators/get-user.decorator';
import { Api, TelegramClient } from 'telegram';
import { TelegramService } from 'src/telegram/services/telegram.service';
import { TelegramMessagesService } from 'src/telegram/services/telegram-messages.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsEntity)
    private readonly postsRepository: Repository<PostsEntity>,
    private readonly uploadPostService: UploadPostService,
    private readonly telegramMessagesService: TelegramMessagesService,
    //private readonly usersService: UsersService,
    private readonly channelRepSerivce: ChannelRepService,
  ) {

  }


  async makePost(postDto: PostDto, uploadDto: UploadDto[], user: UserPayload) {
    console.log();
    const channel = await this.channelRepSerivce.findById(postDto.channelId, { relations: ['posts'], select: ['posts', 'id', 'channelId'] });
    const post = await this.createPost(postDto, uploadDto);
    await this.telegramMessagesService.sendPost(user, channel.channelId, post.uploads);
    // user.posts.push(post);
    // const result = await this.usersService.save(user);
    // const lastPost = result.posts.slice(-1)[0];
    //await this.sendMessage(postDto, lastPost.id);
    //return lastPost;
    return [post, channel];
  }

  // async sendMessage(user: UserPayload, chId: string) {
  //   const client = await this.telegramService.getTelegramClient(user.phone, user.telegramSession);
  //   const channelId = await this.telegramService.makeIdChannel(chId, client);

  //   const message = new Api.messages.SendMessage({
  //     peer: channelId,
  //     message: 'Hello!',
  //   })
  //   return await client.invoke(message);
  // }




  async createPost(postDto: PostDto, uploadDto: UploadDto[]) {
    const post = this.postsRepository.create(postDto);
    post.uploads = await this.createUploads(uploadDto);
    return post;
  }

  // async sendMessage(post: PostDto, postId: string) {
  //   const allId = await this.telegramService.getAllUsersTelegamId();
  //   await this.telegramService.sendAllUsers(allId, post, postId);
  // }

  async createUploads(uploadDto: UploadDto[]): Promise<PostUploadEntity[]> {
    const allUploads = [];
    await Promise.all(
      uploadDto.map(async (e) => {
        const response = this.uploadPostService.createUpload(e);
        allUploads.push(response);
        this.saveInFolder(response.url, response.dir, e.buffer);
        return response;
      }),
    );
    return allUploads;
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


  async sendMedias(ctx: Context, content: PostUploadEntity[]) {
    await Promise.all(this.createMediaPromises(ctx, content));
  }

  createMediaPromises(ctx: Context, content: PostUploadEntity[]) {
    return content.map(cnt => {
      const currType = cnt.mimetype.split('/')[0];
      switch (currType) {
        case 'image': {
          return ctx.replyWithPhoto({ source: cnt.url });
        }
        case 'audio': {
          return ctx.replyWithAudio({ source: cnt.url });
        }
        case 'video': {
          return ctx.replyWithVideo({ source: cnt.url });
        }
      }
    });
  }



}
