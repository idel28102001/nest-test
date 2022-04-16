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
    const [mimetype, secondType] = post.mimetype.split('/'); // Получаем тип файла и его подтип
    switch (mimetype) {
      case 'audio': {
        document = await this.prepareAudio(file, post); // Получаем документ на аудио 
        break;
      }
      case 'image': {
        document = await this.prepareImageType(file, post, secondType); // Получаем документ на фото-тип
        break;
      }
      case 'video': {
        document = await this.prepareVideo(file, post); // Получаем документ на видео
        break;
      }
    }
    return await client.sendFile(peer, document); // Отправляем файл
  }

  async sendMedia(post: UploadDto[], client: TelegramClient, peer: any) { // Отправляем всё медиа за раз
    return await Promise.all(post.map(async e => {
      return await this.sendOneMedia(e, client, peer); // Отправляем одно медиа 
    }));
  }

  async prepareImageType(file: Api.InputFile | Api.InputFileBig, post: UploadDto, secondType) {
    switch (secondType) {
      case 'gif': { // Проверка - если изображение - gif
        return await this.prepareGif(file, post);
      }
      default: {
        return await this.preparePhoto(file); // В остальных случаях - фото
      }
    }
  }



  async preparePhoto(file: Api.InputFile | Api.InputFileBig) { // Подготавливаем фото для отправки
    return new Api.InputMediaUploadedPhoto({ file })
  }
  async prepareVideo(file: Api.InputFile | Api.InputFileBig, post: UploadDto) {//Подготавливаем видео для отправки
    return new Api.InputMediaUploadedDocument({ file, mimeType: post.mimetype, attributes: [] })
  }

  async prepareAudio(file: Api.InputFile | Api.InputFileBig, post: UploadDto) {// Подготавливаем аудио для отправки
    const title = post.originalname.split('.').slice(0, -1).join('.'); // Заголовок ему даём без расширения
    const audio = new Api.DocumentAttributeAudio({ title, duration: post.size / 22050 }); // Создаём атрибут для аудио, где нужно обязательно - "Заголовок" и "Продолжительность". Продолжительность вычисляется по формуле - Кол-во байтов/Дискретную частоту. По стандарту дискретная частота - 22050 гц
    return new Api.InputMediaUploadedDocument({ file, mimeType: post.mimetype, attributes: [audio] })
  }

  async prepareGif(file: Api.InputFile | Api.InputFileBig, post: UploadDto) { //Подготавливаем Гиф для отправки
    return new Api.InputMediaUploadedDocument({ file, mimeType: post.mimetype, attributes: [] })
  }


  async prepareFile(post: UploadDto, client: TelegramClient) { // Готовим основу для файлов
    const mimeType = post.mimetype.split('/')[0]; // Получаем его тип
    const path = `upload/${mimeType}/${post.originalname}`; // Получаем его путь
    const file = new CustomFile(post.originalname, post.size, path); // Создаём экземпляр файла
    return await client.uploadFile({ file, workers: 1 }) // Загружаем файл на телеграм клиент
  }
}