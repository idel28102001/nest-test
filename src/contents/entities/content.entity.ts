import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PostsEntity } from '../../posts/entities/posts.entity';

@Entity({ name: 'contents' })
export class ContentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: true
  })
  mimetype: string;


  @Column()
  originalname: string;

  @Column()
  @ManyToOne(type => PostsEntity, post => post.id)
  postId: string;

  @Column({ default: '' })
  source: string;

  @Column({ default: '' })
  dir: string;

  @BeforeInsert()
  @BeforeUpdate()
  async someCode() {
    this.mimetype = this.mimetype.split('/')[0];
    this.dir = `upload/${this.mimetype}`;
    this.source = `${this.dir}/${this.originalname}`;
  }
}
