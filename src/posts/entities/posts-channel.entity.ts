import { ChannelsEntity } from 'src/channels/entities/channels.entitiy';
import { PostUploadEntity } from 'src/uploadM/entities/post-upload.entity';
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

  @OneToMany(() => PostUploadEntity, upload => upload.post, {
    onDelete: 'SET NULL',
    cascade: true,
  })
  uploads: PostUploadEntity[];
}
