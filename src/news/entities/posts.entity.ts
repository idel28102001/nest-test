import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'posts' })
export class PostsEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', default: Date.now() })
  postedAt: number;

  @Column()
  userId: number;

  @Column()
  title: string;

  @Column('text')
  announcement: string;

  @Column('text')
  description: string;
}
