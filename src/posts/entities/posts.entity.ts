import { ChannelsEntity } from 'src/channels/entities/channels.entitiy';
import { PostUploadEntity } from 'src/uploadM/entities/post-upload.entity';

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
