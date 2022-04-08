import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContentEntity } from '../entities/content.entity';

@Injectable()
export class ContentsService {
  constructor(@InjectRepository(ContentEntity)
  private readonly contentRepository: Repository<ContentEntity>) {

  }
  async save<T>(data: T) {
    const entity = this.contentRepository.create(data);
    return await this.contentRepository.save(entity);
  }

  async findByPostId(postId: string) {
    return await this.contentRepository.find({ where: { postId } });
  }
}
