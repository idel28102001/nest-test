import { Injectable } from '@nestjs/common';
import { UploadDto } from 'src/upload/dto/upload.dto';
import { Api, TelegramClient } from 'telegram';
import { CustomFile, } from 'telegram/client/uploads';

@Injectable()
export class TelegramMessagesService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  async sendOneMedia(post: UploadDto, client: TelegramClient, peer: any) {
    let document: Api.InputMediaUploadedPhoto | Api.InputMediaUploadedDocument;
    const file = await this.prepareFile(post, client); // Подготовить файл
    const [mimetype, secondType] = post.mimetype.split('/');
    switch (mimetype) {
      case 'audio': {
        document = await this.prepareAudio(file, post);
        break;
      }
      case 'image': {
        document = await this.prepareImageType(file, post, secondType);
        break;
      }
      case 'video': {
        document = await this.prepareVideo(file, post);
        break;
      }
    }
    return await client.sendFile(peer, document);
  }

  async sendMedia(post: UploadDto[], client: TelegramClient, peer: any) {
    return await Promise.all(post.map(async e => {
      return await this.sendOneMedia(e, client, peer);
    }));
  }

  async prepareImageType(file: Api.InputFile | Api.InputFileBig, post: UploadDto, secondType) {
    switch (secondType) {
      case 'gif': {
        return await this.prepareGif(file, post);
      }
      default: {
        return await this.preparePhoto(file);
      }
    }
  }



  async preparePhoto(file: Api.InputFile | Api.InputFileBig) {
    return new Api.InputMediaUploadedPhoto({ file })
  }
  async prepareVideo(file: Api.InputFile | Api.InputFileBig, post: UploadDto) {
    return new Api.InputMediaUploadedDocument({ file, mimeType: post.mimetype, attributes: [] })
  }

  async prepareAudio(file: Api.InputFile | Api.InputFileBig, post: UploadDto) {
    const title = post.originalname.split('.').slice(0, -1).join('.');
    const audio = new Api.DocumentAttributeAudio({ title, duration: post.size / 22050 });
    return new Api.InputMediaUploadedDocument({ file, mimeType: post.mimetype, attributes: [audio] })
  }

  async prepareGif(file: Api.InputFile | Api.InputFileBig, post: UploadDto) {
    return new Api.InputMediaUploadedDocument({ file, mimeType: post.mimetype, attributes: [] })
  }


  async prepareFile(post: UploadDto, client: TelegramClient) {
    const mimeType = post.mimetype.split('/')[0];
    const path = `upload/${mimeType}/${post.originalname}`;
    const file = new CustomFile(post.originalname, post.size, path);
    return await client.uploadFile({ file, workers: 1 })
  }
}