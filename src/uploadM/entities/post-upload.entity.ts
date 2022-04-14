import { PostsEntity } from 'src/posts/entities/posts.entity';
import { Entity, ManyToOne } from 'typeorm';
import { UploadEntity } from './upload.entity';
@Entity({ name: 'post_upload' })
export class PostUploadEntity extends UploadEntity {

  @ManyToOne(() => PostsEntity, post => post.uploads, {
    onDelete: 'CASCADE',
  })
  post: PostsEntity;
}