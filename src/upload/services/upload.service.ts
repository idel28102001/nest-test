import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService<T> {
  repository: any;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}
  async save<T>(data: T) {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }
  create(dto: T) {
    return this.repository.create(dto);
  }

  createUpload(content: T) {
    const response = this.repository.create(content); // Создаём сущность загружаемого файла
    const mimeType = response.mimetype.split('/')[0]; // Получаем его тип
    response.dir = `upload/${mimeType}`; // Указываем путь до папки
    response.url = `${response.dir}/${response.originalname}`; // Указываем ему полный путь
    return response; // Возвращаем
  }
}
