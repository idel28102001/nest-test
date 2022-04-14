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
    const response = this.repository.create(content);
    response.mimetype = response.mimetype.split('/')[0];
    response.dir = `upload/${response.mimetype}`;
    response.url = `${response.dir}/${response.originalname}`;
    return response;
  }
}
