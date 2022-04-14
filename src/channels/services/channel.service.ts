import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UserPayload } from 'src/auth/decorators/get-user.decorator';
import { getChannelInfoInterface } from 'src/channels/interfaces/get-channel-info.interface';
import { UploadDto } from 'src/uploadM/dto/upload.dto';
import { UsersService } from 'src/users/services/users.service';
import { CreateChannelDto } from '../dto/create-channel.dto';
import { editPhotoDto } from '../dto/edit-photo.dto';
import { editTitleDto } from '../dto/edit-title.dto';
import { TelegramService } from '../../telegram/services/telegram.service';
import { TelegramChannelService } from '../../telegram/services/telegramm-channel.service';
import { ChannelRepService } from './channel-rep.service';
import { UploadChannelService } from 'src/uploadM/services/upload-channel.service';

@Injectable()
export class ChannelService {
  constructor(
    private readonly telegramService: TelegramService,
    private readonly usersService: UsersService,
    private readonly channelsService: TelegramChannelService,
    private readonly channelRepService: ChannelRepService,
    private readonly uploadChannelService: UploadChannelService,
  ) {}



  async createChannel(userPayload: UserPayload, dto: CreateChannelDto) {
    const { title, about } = dto; // Для канала
    const user = await this.usersService.findById(userPayload.userId, { select: ['telegramSession', 'id', 'phone'], relations: ['channels'] }); // Получаем сущнонсть пользователя
    const client = await this.telegramService.getTelegramClient(user.phone, user.telegramSession); // Получаем клиент
    const newChannel = await this.channelsService.createChannel(dto, client); // Создаём канал
    const channelId = newChannel.chats[0].id.toString(); // Получаем id самого канала
    const channel = this.channelRepService.create({ channelId, title, about });//Создаём сущность канала
    user.channels.push(channel); // Добавляем в список всех элементов
    return (await this.usersService.save(user)).channels.slice(-1)[0]; // Возвращаем последний элемент(что мы создали)
  }


  async deleteChannel(userPayload: UserPayload, id: string) {
    const { phone, telegramSession } = userPayload; // Для канала и клиента
    const channel = await this.channelRepService.findById(id, { select: ['id', 'channelId'] }); //  Сущность канала
    const client = await this.telegramService.getTelegramClient(phone, telegramSession); // Получаем клиента
    await this.channelsService.deleteChannel(channel.channelId, client); // Удаляем канал
    return await this.channelRepService.delete(channel.id); // Удаляем из базы канал

  }


  async getAllChannels(userPayload: UserPayload) {
    const { phone, telegramSession } = userPayload; // Для канала и клиента
    const client = await this.telegramService.getTelegramClient(phone, telegramSession); // Получаем клиента
    const user = await this.usersService.findByPhone(phone, { select: ['channels', 'id'], relations: ['channels'] })
    return await this.channelsService.getAllChannels(client, user.channels);
  }

  async addChannel(userPayload: UserPayload, channelId: string) {
    const { phone, telegramSession } = userPayload; // Для канала и клиента
    const client = await this.telegramService.getTelegramClient(phone, telegramSession); // Получаем клиента
    const channel = await this.channelsService.getChannelByChannelId(channelId, client);


    const about = channel.fullChat.about; // Получаем описание
    const title = (channel.chats[0] as unknown as getChannelInfoInterface).title; // Получаем заголовок

    const channelE = await this.channelRepService.create({ channelId, about, title }); // Создаём сущность канала
    const user = await this.usersService.findByPhone(phone, { select: ['id', 'channels'], relations: ['channels'] }); // Получаем сущность пользователя
    user.channels.push(channelE); // Добавляем пользователю в список каналов
    try {
      const channels = (await this.usersService.save(user)).channels; // Сохраняем
      return channels.slice(-1); // Возвращаем последний добавленный элемент
    } catch (err) {
      throw new BadRequestException('Вы уже добавили этот канал в список доступных');
    }
  }



  async editTitle(userPayload: UserPayload, dto: editTitleDto) {
    const { phone, telegramSession } = userPayload; // Для канала и клиента
    const { title, id } = dto; // Для изменения заголовка у определённого канала
    const channel = await this.channelRepService.findById(id, { select: ['title', 'id', 'channelId'] }); //  Сущность канала
    const client = await this.telegramService.getTelegramClient(phone, telegramSession); // Получаем клиента
    await this.channelsService.editTitle(title, channel.channelId, client); // Меняем заголовок
    channel.title = title; // Для Базы-данных
    return await this.channelRepService.save(channel); // Сохраняем заголовок и возвращаем сущность канала
  }

  async editPhoto(userPayload: UserPayload, photo: UploadDto, dto: editPhotoDto) {
    if (!photo) throw new BadRequestException('Отсутсвует photo для загрузки');
    const { phone, telegramSession } = userPayload; // Для канала и клиента
    const { id } = dto; // Для изменения фото у определённого канала
    const channel = await this.channelRepService.findById(id, { select: ['title', 'id', 'channelId'] }); //  Сущность канала
    const client = await this.telegramService.getTelegramClient(phone, telegramSession); // Получаем клиента
    await this.channelsService.editPhoto(photo, channel, client); // Меняем фото
    return this.uploadChannelService.savePhoto(photo, id.toString(), channel);
  }
}