import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UploadDto } from '../dto/upload.dto';
import { UploadEntity } from '../entities/upload.entity';

@Injectable()
export class UploadService {
  constructor(@InjectRepository(UploadEntity)
  private readonly contentRepository: Repository<UploadEntity>) {

  }
  async save<T>(data: T) {
    const entity = this.contentRepository.create(data);
    return await this.contentRepository.save(entity);
  }

  async findByPostId(postId: string) {
    return await this.contentRepository.find({ where: { postId } });
  }

  create(dto: UploadDto) {
    return this.contentRepository.create(dto);
  }
}
