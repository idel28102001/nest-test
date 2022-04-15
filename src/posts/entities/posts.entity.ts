import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'posts_metadata' })
export class PostsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  postedAt: Date;
  @Column()
  title: string;

  @Column('text')
  description: string;
}
