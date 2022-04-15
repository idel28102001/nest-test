import { PostsChannelEntity } from 'src/posts/entities/posts-channel.entity';
import { UploadFileEntity } from 'src/uploadM/entities/upload-file.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('channels')
export class ChannelsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ unique: true })
  channelId: string;

  @Column({ nullable: true })
  title: string;

  @Column('text', { default: '', nullable: true })
  about: string;

  @ManyToOne(() => UserEntity, user => user.channels, { 'onDelete': 'SET NULL' })
  user: UserEntity;

  @OneToOne(() => UploadFileEntity, file => file.channel, { cascade: true })
  file: UploadFileEntity;


  @OneToMany(() => PostsChannelEntity, (post) => post.channel, {
    cascade: true,
  })
  posts: PostsChannelEntity[];

}