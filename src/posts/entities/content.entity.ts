import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostsEntity } from './posts.entity';

@Entity({ name: 'contents' })
export class ContentEntity {
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

  @ManyToOne(() => PostsEntity, (post) => post.contents, {
    onDelete: 'CASCADE',
  })
  content: PostsEntity;
}
