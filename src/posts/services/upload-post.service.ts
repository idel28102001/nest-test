import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UploadDto } from '../../uploadM/dto/upload.dto';
import { PostUploadEntity } from '../../uploadM/entities/post-upload.entity';
import { UploadService } from '../../uploadM/services/upload.service';

@Injectable()
export class UploadPostService extends UploadService<UploadDto> {
  constructor(
    @InjectRepository(PostUploadEntity)
    readonly repository: Repository<PostUploadEntity>
  ) {
    super()
  }
}
