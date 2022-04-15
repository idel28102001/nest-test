import { BadRequestException, Injectable } from '@nestjs/common';
import { UserPayload } from 'src/auth/decorators/get-user.decorator';
import { getChannelInfoInterface } from 'src/channels/interfaces/get-channel-info.interface';
import { UploadDto } from 'src/uploadM/dto/upload.dto';
import { UsersService } from 'src/users/services/users.service';
import { CreateChannelDto } from '../dto/create-channel.dto';
import { editPhotoDto } from '../dto/edit-photo.dto';
import { editTitleDto } from '../dto/edit-title.dto';
import { TelegramChannelService } from '../../telegram/services/telegram-channel.service';
import { ChannelRepService } from './channel-rep.service';
import { UploadChannelService } from 'src/uploadM/services/upload-channel.service';
import { PostChannelDto } from 'src/posts/dto/post-channel.dto';
import { PostsChannelService } from 'src/posts/services/posts-channel.service';

@Injectable()
export class ChannelService {
  constructor(
    private readonly usersService: UsersService,
    private readonly telegramChannelService: TelegramChannelService,
    private readonly channelRepService: ChannelRepService,
    private readonly uploadChannelService: UploadChannelService,
    private readonly postsChannelService: PostsChannelService,
  ) {}


  async makePost(user: UserPayload, postDto: PostChannelDto, uploadDto: UploadDto[]) {
    const channel = await this.channelRepService.findById(postDto.channelId, { relations: ['posts'], select: ['posts', 'id', 'channelId'] });
    const post = await this.postsChannelService.createPost(postDto, uploadDto);
    const result = await this.postsChannelService.sendPost(user, channel.channelId, postDto, uploadDto);
    console.log(result);
    // user.posts.push(post);
    // const result = await this.usersService.save(user);
    // const lastPost = result.posts.slice(-1)[0];
    // await this.sendMessage(postDto, lastPost.id);
    // return lastPost;
    // return [post, channel];
  }



  async createChannel(userPayload: UserPayload, dto: CreateChannelDto) {
    const { phone, telegramSession } = userPayload; // Для канала и клиента
    const { title, about } = dto; // Для канала
    const user = await this.usersService.findById(userPayload.userId, { select: ['telegramSession', 'id', 'phone'], relations: ['channels'] }); // Получаем сущнонсть пользователя
    const newChannel = await this.telegramChannelService.createChannel(dto, phone, telegramSession); // Создаём канал
    const channelId = newChannel.chats[0].id.toString(); // Получаем id самого канала
    const channel = this.channelRepService.create({ channelId, title, about });//Создаём сущность канала
    user.channels.push(channel); // Добавляем в список всех элементов
    return (await this.usersService.save(user)).channels.slice(-1)[0]; // Возвращаем последний элемент(что мы создали)
  }


  async deleteChannel(userPayload: UserPayload, id: string) {
    const { phone, telegramSession } = userPayload; // Для канала и клиента
    const channel = await this.channelRepService.findById(id, { select: ['id', 'channelId'] }); //  Сущность канала
    await this.telegramChannelService.deleteChannel(channel.channelId, phone, telegramSession); // Удаляем канал
    return await this.channelRepService.delete(channel.id); // Удаляем из базы канал

  }


  async getAllChannels(userPayload: UserPayload) {
    const { phone, telegramSession } = userPayload; // Для канала и клиента
    const user = await this.usersService.findByPhone(phone, { select: ['channels', 'id'], relations: ['channels'] })
    return await this.telegramChannelService.getAllChannels(user.channels, phone, telegramSession);
  }

  async addChannel(userPayload: UserPayload, channelId: string) {
    const { phone, telegramSession } = userPayload; // Для канала и клиента
    const channel = await this.telegramChannelService.getChannelByChannelId(channelId, phone, telegramSession);


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
    await this.telegramChannelService.editTitle(title, channel.channelId, phone, telegramSession); // Меняем заголовок
    channel.title = title; // Для Базы-данных
    return await this.channelRepService.save(channel); // Сохраняем заголовок и возвращаем сущность канала
  }

  async editPhoto(userPayload: UserPayload, photo: UploadDto, dto: editPhotoDto) {
    if (!photo) throw new BadRequestException('Отсутсвует photo для загрузки');
    const { phone, telegramSession } = userPayload; // Для канала и клиента
    const { id } = dto; // Для изменения фото у определённого канала
    const channel = await this.channelRepService.findById(id, { select: ['title', 'id', 'channelId'] }); //  Сущность канала
    await this.telegramChannelService.editPhoto(photo, channel, phone, telegramSession); // Меняем фото
    return this.uploadChannelService.savePhoto(photo, id.toString(), channel);
  }
}