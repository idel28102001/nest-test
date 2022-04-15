import { ChannelsEntity } from 'src/channels/entities/channels.entitiy';
import { UploadPostEntity } from 'src/uploadM/entities/upload-post.entity';
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

  @OneToMany(() => UploadPostEntity, upload => upload.post, {
    onDelete: 'SET NULL',
    cascade: true,
  })
  uploads: UploadPostEntity[];
}
