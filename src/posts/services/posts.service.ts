import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOneOptions } from 'typeorm';
import { UploadDto } from '../../upload/dto/upload.dto';
import * as fs from 'fs';
import { PostDto } from '../dto/post.dto';

@Injectable()
export class PostsService<T, V> {
  readonly repository: any; // Основной репозиторий, от которого будут создаваться и сохранятся сущности
  readonly uploadService: any; // Сервис, который будет сохранять в папку текущие файлы
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  createPost(postDto: PostDto): T { // Создаём сущность поста
    return this.repository.create(postDto);
  }

  async createUpload(uploadDto: UploadDto): Promise<V> { // Создаём сущность загруженных файлов у поста
    const response = await this.uploadService.createUpload(uploadDto); // Создаём сущность
    this.saveInFolder(response.url, response.dir, uploadDto.buffer); // Сохраняем в папке загруженные файлы
    return response; // Возвращаем
  }

  async createUploads(uploadDto: UploadDto[]): Promise<V[]> { // Сохраняем и возвращаем коллекцию сущностей загруженных файлов
    return await Promise.all(
      uploadDto.map((e) => this.createUpload(e)),
    );
  }



  saveInFolder(src: string, dir: string, buffer: Buffer) { // Сохраняем в папке
    this.createFolders(dir) // Создаём путь
    fs.writeFileSync(src, buffer); // Сохраняем на путь файл
  }

  createFolders(src: string) { // Создаём путь
    if (!fs.existsSync('upload')) { //Проверяем наличие главной папки
      fs.mkdirSync('upload') // Создаём её
    }

    if (!fs.existsSync(src)) { //Проверяем наличие пути
      fs.mkdirSync(src);  // Создаём путь
    }
  }

  checkUuid(id: string) { //Проверка строки на UUID
    const pattern = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
    return pattern.test(id);
  }

  async getPostById(id?: string, options?: FindOneOptions<T>) { // Получаем пост по его ID
    if (this.checkUuid(id)) {
      return await this.repository.findOne(id, options);;
    } else {
      throw new NotFoundException();
    }
  }

  async getAllPosts() { // Получаем все посты
    return await this.repository.find();
  }
  async deletePost(id: string) { // Удаляем пост по ID
    return await this.repository.delete(id);
  }
}
