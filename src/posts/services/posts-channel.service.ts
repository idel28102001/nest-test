import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UploadDto } from '../../upload/dto/upload.dto';
import { UserPayload } from 'src/auth/decorators/get-user.decorator';
import { PostChannelDto } from '../dto/post-channel.dto';
import { PostsChannelEntity } from '../entities/posts-channel.entity';
import { PostsService } from './posts.service';
import { TelegramChannelService } from 'src/telegram/services/telegram-channel.service';
import { UploadChannelService } from 'src/upload/services/upload-channel.service';
import { UploadFileEntity } from 'src/upload/entities/upload-file.entity';

@Injectable()
export class PostsChannelService extends PostsService<PostsChannelEntity, UploadFileEntity> {
  constructor(
    @InjectRepository(PostsChannelEntity)
    readonly repository: Repository<PostsChannelEntity>,
    readonly uploadService: UploadChannelService,
    private readonly telegramChannelService: TelegramChannelService,
  ) {
    super()
  }

  async sendPost(userPayload: UserPayload, channelId: string, postDto: PostChannelDto, uploadDto: UploadDto[]) {
    const {client, peer} = await this.telegramChannelService.preparePropertiesForChannel(channelId, userPayload);
    const textPost = await this.telegramChannelService.sendTextPost(postDto, client, peer);
    const post = this.makePost(postDto, textPost.id.toString());
    post.uploads = await Promise.all(uploadDto.map(async e => {
      const media = await this.telegramChannelService.sendOneMedia(e, client, peer);
      const upload = await this.createUpload(e);
      upload.fileId = media.id.toString();
      return upload;
    }));
    return post;
  }

  makePost(postDto: PostChannelDto, id: string) {
    const post = this.createPost(postDto);
    post.title = postDto.title;
    post.description = postDto.description;
    post.postId = id;
    return post;
  }
}
