import { Injectable } from '@nestjs/common';
import { UserPayload } from 'src/auth/decorators/get-user.decorator';
import { PostDto } from 'src/posts/dto/post.dto';
import { UploadDto } from 'src/uploadM/dto/upload.dto';
import { PostUploadEntity } from 'src/uploadM/entities/post-upload.entity';
import { Api, TelegramClient } from 'telegram';
import { CustomFile } from 'telegram/client/uploads';
import { TelegramService } from './telegram.service';

@Injectable()
export class TelegramMessagesService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private readonly telegramService: TelegramService) {}


  async sendPost(user: UserPayload, chId: string, posts: PostUploadEntity[]) {
    const client = await this.telegramService.getTelegramClient(user.phone, user.telegramSession);
    const channelId = await this.telegramService.makeIdChannel(chId, client);

    const message = new Api.messages.SendMessage({
      peer: channelId,
      message: 'Hello!',
    })
    return await client.invoke(message);
  }



  async preparePhoto(post: PostUploadEntity, client: TelegramClient) {
    const file = await this.prepareFile(post, client);
    const photo = new Api.InputMediaUploadedPhoto({ file }) as unknown as Api.TypeInputMedia;
    return new Api.InputSingleMedia({ media: photo, message: 'as' })
  }

  async prepareFile(post: PostUploadEntity, client: TelegramClient) {
    const file = new CustomFile(post.originalname, post.size, post.url);
    return await client.uploadFile({ file, workers: 1 }) as unknown as Api.TypeInputFile;
  }
}