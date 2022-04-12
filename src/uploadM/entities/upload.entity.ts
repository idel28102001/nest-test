import { PostsEntity } from 'src/posts/entities/posts.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'uploads' })
export class UploadEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: true,
  })
  mimetype: string;

  @Column()
  originalname: string;

  @Column({ default: '' })
  source: string;

  @Column({ default: '' })
  dir: string;


  @ManyToOne(() => PostsEntity, post => post.uploads, {
    onDelete: 'CASCADE',
  })
  post: PostsEntity;
}
