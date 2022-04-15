import { ChannelsEntity } from 'src/channels/entities/channels.entitiy';
import { UploadFileEntity } from 'src/upload/entities/upload-file.entity';
import {
  Entity,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { PostsEntity } from './posts.entity';

@Entity({ name: 'posts_channel' })
export class PostsChannelEntity extends PostsEntity {

  @ManyToOne(() => ChannelsEntity, (user) => user.posts, {
    onDelete: 'SET NULL',
  })
  channel: ChannelsEntity;

  @OneToMany(() => UploadFileEntity, upload => upload.channelPost, {
    onDelete: 'SET NULL',
    cascade: true,
  })
  uploads: UploadFileEntity[];
}
