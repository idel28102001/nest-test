import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateChannelDto } from 'src/channels/dto/create-channel.dto';
import { Api, TelegramClient } from 'telegram';
import { ChannelsEntity } from '../../channels/entities/channels.entitiy';
import { UploadDto } from 'src/uploadM/dto/upload.dto';
import { getDialogsInterface } from '../../channels/interfaces/get-dialogs.interface';
import { CustomFile } from 'telegram/client/uploads';
import { TelegramService } from './telegram.service';
import { UserPayload } from 'src/auth/decorators/get-user.decorator';
import { PostsChannelEntity } from 'src/posts/entities/posts-channel.entity';
import { PostChannelDto } from 'src/posts/dto/post-channel.dto';
import { TelegramMessagesService } from './telegram-messages.service';

@Injectable()
export class TelegramChannelService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(
    private readonly telegramService: TelegramService,
    private readonly telegramMessagesService: TelegramMessagesService, 
  ) {}

  async sendPost(userPayload: UserPayload, chId: string, postDto: PostChannelDto, posts: UploadDto[]) {
    await this.sendTextPost(postDto, chId, userPayload);
    return await this.telegramMessagesService.sendMedia(posts, chId, userPayload);
  }

  async sendOneMedia(post: UploadDto, chId: string, userPayload: UserPayload) {
    const { client, peer } = await this.telegramService.preparePropertiesForChannel(chId, userPayload);
    return await this.telegramMessagesService.sendOneMedia(post, client, peer);
  }

  async sendTextPost(postDto: PostChannelDto, chId: string, userPayload: UserPayload) {
    const { client, peer } = await this.telegramService.preparePropertiesForChannel(chId, userPayload);
    const text = `<strong>${postDto.title}</strong>\n${postDto.description}`;
    return await client.sendMessage(peer, { message: text, parseMode: 'html' });
  }



  async deleteChannel(id: string, phone: string, telegramSession?: string) {
    const client = await this.telegramService.getTelegramClient(phone, telegramSession); // Получаем клиент
    const channelId = await this.telegramService.makeIdChannel(id, client); // Создаём "Id-канала"
    try {
      return await client.invoke(new Api.channels.DeleteChannel({ channel: channelId })) // Меняем заголовок
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async getAllChannels(channelsE: ChannelsEntity[], phone: string, telegramSession?: string) {
    const client = await this.telegramService.getTelegramClient(phone, telegramSession); // Получаем клиент
    const channels = new Map();
    channelsE.forEach(e => {
      channels.set(e.channelId, e.id);
    });
    return (await client.getDialogs({}) as unknown as getDialogsInterface[]) // Получаем весь список диалогов
      .filter((dialog) => dialog.isChannel && dialog.entity.creator) // Фильтруем по типу диалога и по "создателю"
      .map(e => { return { channelId: e.entity.id, title: e.title, id: channels.get(e.entity.id.toString()) || null } }) // Возвращаем объекты
  }

  async createChannel(dto: CreateChannelDto, phone: string, telegramSession?: string): Promise<Api.Updates> {
    const { title, about } = dto; // Для канала
    const client = await this.telegramService.getTelegramClient(phone, telegramSession); // Получаем клиент
    try {
      return (await client.invoke(new Api.channels.CreateChannel({ title, about }))) as unknown as Api.Updates; // Создаём канал
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async editTitle(title: string, id: string, phone: string, telegramSession?: string) {
    const client = await this.telegramService.getTelegramClient(phone, telegramSession);
    const channelId = await this.telegramService.makeIdChannel(id, client); // Создаём "Id-канала"
    try {
      return await client.invoke(new Api.channels.EditTitle({ channel: channelId, title })) // Меняем заголовок
    } catch (err) {
      throw new BadRequestException(err);
    }
  }


  async getChannelByChannelId(id: string, phone: string, telegramSession?: string) {
    const client = await this.telegramService.getTelegramClient(phone, telegramSession);
    const channel = await this.telegramService.makeIdChannel(id, client);
    try {
      return await client.invoke(new Api.channels.GetFullChannel({ channel }));
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async editPhoto(photoDto: UploadDto, channelE: ChannelsEntity, phone: string, telegramSession?: string) {
    const client = await this.telegramService.getTelegramClient(phone, telegramSession);
    const channel = await this.telegramService.makeIdChannel(channelE.channelId, client); // Создаём Id канала
    const file = new CustomFile( // Создаём экземпляр файла
      photoDto.originalname, // Название файла
      photoDto.size,//Его размер в байтах
      `upload/image/${photoDto.originalname}`, // Его путь
      photoDto.buffer // Буффер(байты), опциональный
    );
    const photo = await client.uploadFile({ file, workers: 1 }) as unknown as Api.InputChatPhoto; // Загружаем файл
    return await client.invoke(new Api.channels.EditPhoto({ channel, photo })) // Меняем фото на профиле канала
  }
}
