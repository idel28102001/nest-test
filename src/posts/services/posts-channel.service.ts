import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { UploadDto } from '../../uploadM/dto/upload.dto';
import * as fs from 'fs';
import { Context } from 'vm';
import { Context as Ctx } from 'telegraf';
import { UsersService } from 'src/users/services/users.service';
import { PostDto } from '../dto/post.dto';
import { UploadPostEntity } from 'src/uploadM/entities/upload-post.entity';
import { ChannelService } from 'src/channels/services/channel.service';
import { PostsUploadService } from './posts-upload.service';
import { ChannelRepService } from 'src/channels/services/channel-rep.service';
import { UserPayload } from 'src/auth/decorators/get-user.decorator';
import { Api, TelegramClient } from 'telegram';
import { TelegramService } from 'src/telegram/services/telegram.service';
import { TelegramMessagesService } from 'src/telegram/services/telegram-messages.service';
import { PostChannelDto } from '../dto/post-channel.dto';
import { PostsChannelEntity } from '../entities/posts-channel.entity';
import { PostsService } from './posts.service';
import { TelegramChannelService } from 'src/telegram/services/telegram-channel.service';

@Injectable()
export class PostsChannelService extends PostsService<PostsChannelEntity> {
  constructor(
    @InjectRepository(PostsChannelEntity)
    readonly repository: Repository<PostsChannelEntity>,
    readonly uploadPostService: PostsUploadService,
    private readonly telegramChannelService: TelegramChannelService,
    // private readonly uploadPostService: UploadPostService,
    //private readonly telegramMessagesService: TelegramMessagesService,
    //private readonly channelRepSerivce: ChannelRepService,
  ) {
    super()
  }

  async sendPost(userPayload: UserPayload, channelId: string, postDto: PostChannelDto, uploadDto: UploadDto[]) {
    const textPost = await this.telegramChannelService.sendTextPost(postDto, channelId, userPayload);
    Promise.all(uploadDto.map(async e=>{
      const media = await this.telegramChannelService.sendOneMedia(e, channelId, userPayload);
      const post = await this.createUpload(e);
      console.log(media);
    }));
    console.log(textPost);
  }


  // async makePost(postDto: PostChannelDto, uploadDto: UploadDto[], user: UserPayload) {
  //   console.log();
  //   const channel = await this.channelRepSerivce.findById(postDto.channelId, { relations: ['posts'], select: ['posts', 'id', 'channelId'] });
  //   const post = await this.createPost(postDto, uploadDto);
  //   await this.telegramMessagesService.sendPost(user, channel.channelId, uploadDto, post);
  //   // user.posts.push(post);
  //   // const result = await this.usersService.save(user);
  //   // const lastPost = result.posts.slice(-1)[0];
  //   //await this.sendMessage(postDto, lastPost.id);
  //   //return lastPost;
  //   return [post, channel];
  // }



  // async sendMessageToTGUser(ctx: Ctx, postId: string) {
  //   const post = await this.getPostById(postId, { relations: ['uploads'] });
  //   await this.sendMedias(ctx, post.uploads);
  //   await ctx.reply(post.description);
  //   await ctx.replyWithPoll('Как вам пост?', ['Нравится', 'Не нравится', 'Посмотреть результаты'], { allows_multiple_answers: false, is_anonymous: true, });
  // }


  // async sendMedias(ctx: Context, content: UploadPostEntity[]) {
  //   await Promise.all(this.createMediaPromises(ctx, content));
  // }

  // createMediaPromises(ctx: Context, content: UploadPostEntity[]) {
  //   return content.map(cnt => {
  //     const currType = cnt.mimetype.split('/')[0];
  //     switch (currType) {
  //       case 'image': {
  //         return ctx.replyWithPhoto({ source: cnt.url });
  //       }
  //       case 'audio': {
  //         return ctx.replyWithAudio({ source: cnt.url });
  //       }
  //       case 'video': {
  //         return ctx.replyWithVideo({ source: cnt.url });
  //       }
  //     }
  //   });
  // }



}
