import { Injectable } from '@nestjs/common';
import { UploadDto } from 'src/uploadM/dto/upload.dto';
import { Api, TelegramClient } from 'telegram';
import { CustomFile } from 'telegram/client/uploads';
import { TelegramService } from './telegram.service';

@Injectable()
export class TelegramMessagesService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private readonly telegramService: TelegramService) {}

  async sendMedia(post: UploadDto, client: TelegramClient, peer: any) {
    const media = await this.preparePhoto(post, client);
    return new Api.messages.SendMedia({ peer, media, message: '' });
  }



  async preparePhoto(post: UploadDto, client: TelegramClient) {
    const file = await this.prepareFile(post, client);
    return new Api.InputMediaUploadedPhoto({ file })
  }

  async prepareDocument(post: UploadDto, client: TelegramClient) {
    const file = await this.prepareFile(post, client);
    return new Api.InputMediaUploadedDocument({ file, mimeType: post.mimetype, attributes: [] })
  }


  async prepareFile(post: UploadDto, client: TelegramClient) {
    const mimeType = post.mimetype.split('/')[0];
    const path = `upload/${mimeType}/${post.originalname}`;
    const file = new CustomFile(post.originalname, post.size, path);
    return await client.uploadFile({ file, workers: 1 })
  }
}