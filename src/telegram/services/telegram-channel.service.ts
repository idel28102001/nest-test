import { BadRequestException, Injectable, NotAcceptableException } from '@nestjs/common';
import { UserPayload } from 'src/auth/decorators/get-user.decorator';
import { ChannelService } from 'src/channels/services/channel.service';
import { UploadDto } from 'src/uploadM/dto/upload.dto';
import { UsersService } from 'src/users/services/users.service';
import { CreateChannelDto } from '../dto/create-channel.dto';
import { editPhotoDto } from '../dto/edit-photo.dto';
import { editTitleDto } from '../dto/edit-title.dto';
import { TelegramService } from './telegram.service';

@Injectable()
export class TelegramChannelService {
  constructor(private readonly service: TelegramService,
    private readonly usersService: UsersService,
    private readonly channelsService: ChannelService,
  ) {}


  async createChannel(userPayload: UserPayload, dto: CreateChannelDto) {
    const { title, about } = dto; // Для канала
    const user = await this.usersService.findById(userPayload.userId, { select: ['telegramSession', 'id', 'phone'], relations: ['channels'] }); // Получаем сущнонсть пользователя
    const client = await this.service.getTelegramClient(user.phone, user.telegramSession); // Получаем клиент
    const newChannel = await this.channelsService.createChannel(dto, client); // Создаём канал
    const channelId = newChannel.chats[0].id.toString(); // Получаем id самого канала
    const channel = this.channelsService.create({ channelId, title, description: about });//Создаём сущность канала
    user.channels.push(channel); // Добавляем в список всех элементов
    return (await this.usersService.save(user)).channels.slice(-1)[0]; // Возвращаем последний элемент(что мы создали)
  }


  async deleteChannel(userPayload: UserPayload, id: string) {
    const { phone, telegramSession } = userPayload; // Для канала и клиента
    const channel = await this.channelsService.findById(id, { select: ['id', 'channelId'] }); //  Сущность канала
    const client = await this.service.getTelegramClient(phone, telegramSession); // Получаем клиента
    await this.channelsService.deleteChannel(channel.channelId, client); // Удаляем канал
    return await this.channelsService.delete(channel.id); // Удаляем из базы канал

  }



  async editTitle(userPayload: UserPayload, dto: editTitleDto) {
    const { phone, telegramSession } = userPayload; // Для канала и клиента
    const { title, id } = dto; // Для изменения заголовка у определённого канала
    const channel = await this.channelsService.findById(id, { select: ['title', 'id', 'channelId'] }); //  Сущность канала
    const client = await this.service.getTelegramClient(phone, telegramSession); // Получаем клиента
    await this.channelsService.editTitle(title, channel.channelId, client); // Меняем заголовок
    channel.title = title; // Для Базы-данных
    return await this.channelsService.save(channel); // Сохраняем заголовок и возвращаем сущность канала
  }

  // async editPhoto(userPayload: UserPayload, photo: UploadDto, dto: editPhotoDto) {
  //   console.log(photo);
  //   if (!photo) throw new BadRequestException('Отсутсвует photo для загрузки');
  //   const { phone, telegramSession } = userPayload; // Для канала и клиента
  //   const { id } = dto; // Для изменения фото у определённого канала
  //   const channel = await this.channelsService.findById(id, { select: ['title', 'id', 'channelId'] }); //  Сущность канала
  //   const client = await this.service.getTelegramClient(phone, telegramSession); // Получаем клиента
  //   console.log(photo);
  //   await this.channelsService.editPhoto(photo, channel.channelId, client); // Меняем заголовок
    //channel.title = title; // Для Базы-данных
    //return await this.channelsService.save(channel); // Сохраняем заголовок и возвращаем сущность канала
  //}
}