
import { PostsChannelEntity } from 'src/posts/entities/posts-channel.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { UploadEntity } from './upload.entity';

@Entity({ name: 'upload_files' })
export class UploadFileEntity extends UploadEntity {

  @ManyToOne(() => PostsChannelEntity, channel => channel.uploads, {
    onDelete: 'CASCADE'
  })
  channelPost: PostsChannelEntity;

  @Column({ nullable: true })
  fileId: string;
}