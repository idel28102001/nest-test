import { UploadEntity } from 'src/upload/entities/upload.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'posts' })
export class PostsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  postedAt: Date;

  @Column()
  title: string;

  @Column('text')
  announcement: string;

  @Column('text')
  description: string;

  @ManyToOne(() => UserEntity, (user) => user.posts, {
    onDelete: 'SET NULL',
  })
  user: UserEntity;

  @OneToMany(() => UploadEntity, upload => upload.post, {
    onDelete: 'SET NULL',
    cascade: true,
  })
  uploads: UploadEntity[];
}
