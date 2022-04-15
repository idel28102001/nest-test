import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOneOptions } from 'typeorm';
import { UploadDto } from '../../upload/dto/upload.dto';
import * as fs from 'fs';
import { PostDto } from '../dto/post.dto';

@Injectable()
export class PostsService<T, V> {
  readonly repository: any;
  readonly uploadService: any;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  createPost(postDto: PostDto): T {
    return this.repository.create(postDto);
  }

  async createUpload(uploadDto: UploadDto): Promise<V> {
    const response = await this.uploadService.createUpload(uploadDto);
    this.saveInFolder(response.url, response.dir, uploadDto.buffer);
    return response;
  }

  async createUploads(uploadDto: UploadDto[]): Promise<V[]> {
    return await Promise.all(
      uploadDto.map((e) => this.createUpload(e)),
    );
  }



  saveInFolder(src: string, dir: string, buffer: Buffer) {
    this.createFolders(dir)
    fs.writeFileSync(src, buffer);
  }

  createFolders(src: string) {
    if (!fs.existsSync('upload')) {
      fs.mkdirSync('upload')
    }

    if (!fs.existsSync(src)) {
      fs.mkdirSync(src);
    }
  }

  checkUuid(id: string) {
    const pattern = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
    return pattern.test(id);
  }

  async getPostById(id?: string, options?: FindOneOptions<T>) {
    if (this.checkUuid(id)) {
      return await this.repository.findOne(id, options);;
    } else {
      throw new NotFoundException();
    }
  }

  async getAllPosts() {
    return await this.repository.find();
  }
  async deletePost(id: string) {
    return await this.repository.delete(id);
  }
}
