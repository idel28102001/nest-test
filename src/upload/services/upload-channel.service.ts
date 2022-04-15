import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelsEntity } from 'src/channels/entities/channels.entitiy';
import { Repository } from 'typeorm';
import { UploadDto } from '../dto/upload.dto';
import { UploadFileEntity } from '../entities/upload-file.entity';
import { UploadService } from './upload.service';

@Injectable()
export class UploadChannelService extends UploadService<UploadDto> {
  constructor(
    @InjectRepository(UploadFileEntity)
    readonly repository: Repository<UploadFileEntity>
  ) {
    super()
  }
  async savePhoto(photo: UploadDto, id: string, channel: ChannelsEntity) {
    const photoE = await this.createUpload(photo);
    photoE.photoId = id;
    channel.photo = photoE;
    return (await this.save(channel)).photo;
  }
}
