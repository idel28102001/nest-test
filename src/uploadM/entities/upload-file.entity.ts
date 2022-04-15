import { ChannelsEntity } from 'src/channels/entities/channels.entitiy';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { UploadEntity } from './upload.entity';

@Entity({ name: 'upload_photo' })
export class UploadFileEntity extends UploadEntity {

  @OneToOne(() => ChannelsEntity, channel => channel.file, {
    onDelete: 'CASCADE'
  })
  @JoinColumn()
  channel: ChannelsEntity;

  @Column({ nullable: true })
  photoId: string;
}