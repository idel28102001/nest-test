
import { PostsChannelEntity } from 'src/posts/entities/posts-channel.entity';
import { Entity, ManyToOne } from 'typeorm';
import { UploadEntity } from './upload.entity';
@Entity({ name: 'post_upload' })
export class PostUploadEntity extends UploadEntity {

  @ManyToOne(() => PostsChannelEntity, post => post.uploads, {
    onDelete: 'CASCADE',
  })
  post: PostsChannelEntity;
}