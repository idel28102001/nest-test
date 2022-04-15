import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UploadDto } from '../../uploadM/dto/upload.dto';
import { UploadPostEntity } from '../../uploadM/entities/upload-post.entity';
import { UploadService } from '../../uploadM/services/upload.service';

@Injectable()
export class PostsUploadService extends UploadService<UploadDto> {
  constructor(
    @InjectRepository(UploadPostEntity)
    readonly repository: Repository<UploadPostEntity>
  ) {
    super()
  }
}
