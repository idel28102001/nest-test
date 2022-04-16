import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateChannelDto } from 'src/channels/dto/create-channel.dto';
import { Api, TelegramClient } from 'telegram';
import { ChannelsEntity } from '../../channels/entities/channels.entitiy';
import { UploadDto } from 'src/upload/dto/upload.dto';
import { getDialogsInterface } from '../../channels/interfaces/get-dialogs.interface';
import { CustomFile } from 'telegram/client/uploads';
import { TelegramService } from './telegram.service';
import { UserPayload } from 'src/auth/decorators/get-user.decorator';
import { PostChannelDto } from 'src/posts/dto/post-channel.dto';
import { TelegramMessagesService } from './telegram-messages.service';

@Injectable()
export class TelegramChannelService {
  constructor(
    private readonly telegramService: TelegramService,
    private readonly telegramMessagesService: TelegramMessagesService,
  ) {}

  async sendPost(postDto: PostChannelDto, posts: UploadDto[], client: TelegramClient, peer: any) {
    await this.sendTextPost(postDto, client, peer); // Отправляем текстовый пост
    return await this.telegramMessagesService.sendMedia(posts, client, peer); // Отправляем всё медиа
  }

  async sendOneMedia(post: UploadDto, client: TelegramClient, peer: any) { // Отправляем один медиа файл
    return await this.telegramMessagesService.sendOneMedia(post, client, peer);
  }

  async preparePropertiesForChannel(chId: string, userPayload: UserPayload) { // Доп. функция для переиспользования в другом модуле(чтобы лишний раз не подгружать telegramSerice ради одной функции)
    return await this.telegramService.preparePropertiesForChannel(chId, userPayload);
  }

  async sendTextPost(postDto: PostChannelDto, client: TelegramClient, peer: any) {// Отправляем текстовый файл
    const text = `<strong>${postDto.title}</strong>\n${postDto.description}`; // Готовим текст для отправки
    return await client.sendMessage(peer, { message: text, parseMode: 'html' }); // Отправляем с парсин модом - "HTML"
  }



  async deleteChannel(channelId: string, userPayload: UserPayload) {
    const { client, peer } = await this.telegramService.preparePropertiesForChannel(channelId, userPayload); // Для канала и клиента
    try {
      return await client.invoke(new Api.channels.DeleteChannel({ channel: peer })) // Меняем заголовок
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async getAllChannels(channelsE: ChannelsEntity[], phone: string, telegramSession?: string) {
    const client = await this.telegramService.getTelegramClient(phone, telegramSession); // Получаем клиент
    const channels = new Map(); // Создаём коллекцию 'channelID(из БД) - id(Из телеграма)'
    channelsE.forEach(e => {
      channels.set(e.channelId, e.id);
    });
    return (await client.getDialogs({}) as unknown as getDialogsInterface[]) // Получаем весь список диалогов
      .filter((dialog) => dialog.isChannel && dialog.entity.creator) // Фильтруем по типу диалога и по "создателю"
      .map(e => { return { channelId: e.entity.id, title: e.title, 
        id: channels.get(e.entity.id.toString()) || null // Проверка на наличие id в БД
       } }) // Возвращаем объекты
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

  async editTitle(title: string,userPayload: UserPayload, channelId: string) {
    const { client, peer } = await this.telegramService.preparePropertiesForChannel(channelId, userPayload); // Для канала и клиента
    try {
      return await client.invoke(new Api.channels.EditTitle({ channel: peer, title })) // Меняем заголовок
    } catch (err) {
      throw new BadRequestException(err);
    }
  }


  async getChannelByChannelId(channelId: string, userPayload: UserPayload) {
    const { client, peer } = await this.telegramService.preparePropertiesForChannel(channelId, userPayload); // Для канала и клиента
    try {
      return await client.invoke(new Api.channels.GetFullChannel({ channel: peer })); // Возвращаем полные данные по каналу
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
