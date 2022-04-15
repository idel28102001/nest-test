import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOneOptions } from 'typeorm';
import { UploadDto } from '../../uploadM/dto/upload.dto';
import * as fs from 'fs';
import { PostDto } from '../dto/post.dto';
import { UploadPostEntity } from 'src/uploadM/entities/upload-post.entity';
import { PostsUploadService } from './posts-upload.service';
import { PostsChannelEntity } from '../entities/posts-channel.entity';

@Injectable()
export class PostsService<T> {
  readonly repository: any;
  readonly PostUploadService: any;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  async createPost(postDto: PostDto, uploadDto: UploadDto[]) {
    const post = this.repository.create(postDto);
    post.uploads = await this.createUploads(uploadDto);
    return post;
  }

  async createUpload(uploadDto: UploadDto): Promise<UploadPostEntity> {
    const response = await this.PostUploadService.createUpload(uploadDto); ///ТУТ ПОРАБОТАТЬ!!!!
    this.saveInFolder(response.url, response.dir, uploadDto.buffer);
    return response;
  }

  async createUploads(uploadDto: UploadDto[]): Promise<UploadPostEntity[]> {
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
