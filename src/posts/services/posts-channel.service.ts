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
    readonly repository: Repository<PostsChannelEntity>, // Определяем наш главный репозиторий как "Посты Канала"
    readonly uploadService: UploadChannelService, // Определяем наш сохраняющий файлов в папку как "Загрузки Канала"
    private readonly telegramChannelService: TelegramChannelService, // Сервис для отправки в телеграм канал данных
  ) {
    super()
  }

  async sendPost(userPayload: UserPayload, channelId: string, postDto: PostChannelDto, uploadDto: UploadDto[]) {
    const {client, peer} = await this.telegramChannelService.preparePropertiesForChannel(channelId, userPayload); // Получаем данные по клиенту и саму "ссылку" на канал
    const textPost = await this.telegramChannelService.sendTextPost(postDto, client, peer); // Отправляем текстовую часть поста
    const post = this.makePost(postDto, textPost.id.toString()); // Создаём сущность поста
    post.uploads = await Promise.all(uploadDto.map(async e => { // Устанавливаем посту коллекцию загружаемых объектов
      const media = await this.telegramChannelService.sendOneMedia(e, client, peer); // Отправляем в телеграм канал текущее медиа
      const upload = await this.createUpload(e); // Создаём сущность одного загружаемого файла
      upload.fileId = media.id.toString(); // Добавляем ему id файла в телеграм канале
      return upload; // Возвращаем сущность файла
    }));
    return post; // Возвращаем сущность поста
  }

  makePost(postDto: PostChannelDto, id: string) { // Создаём сущность поста
    const post = this.createPost(postDto); // Создаём сущность поста
    post.postId = id; // Добавляем ему ID в телеграм канале
    return post; // Возвращаем
  }
}
