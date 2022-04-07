import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'posts' })
export class PostsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'bigint', default: Date.now() })
  postedAt: number;

  @Column()
  userId: string;

  @Column()
  title: string;

  @Column('text')
  announcement: string;

  @Column('text')
  description: string;
}
