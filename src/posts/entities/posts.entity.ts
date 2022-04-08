import { UserEntity } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ContentEntity } from '../../contents/entities/content.entity';

@Entity({ name: 'posts' })
export class PostsEntity {
  @PrimaryGeneratedColumn('uuid')
  @OneToMany(type => ContentEntity, content => content.postId)
  id: string;

  @Column({ type: 'bigint', default: Date.now() })
  postedAt: number;

  @Column()
  @ManyToOne(type => UserEntity, user => user.id)
  userId: string;

  @Column()
  title: string;

  @Column('text')
  announcement: string;

  @Column('text')
  description: string;
}
