import { ChannelsEntity } from 'src/channels/entities/channels.entitiy';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { UploadEntity } from './upload.entity';

@Entity({ name: 'photo_upload' })
export class ChannelPhotoEntity extends UploadEntity {

  @OneToOne(() => ChannelsEntity, channel => channel.photo, {
    onDelete: 'CASCADE'
  })
  @JoinColumn()
  channel: ChannelsEntity;

  @Column({ nullable: true })
  photoId: string;
}