import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'contents' })
export class ContentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  mimetype: string;

  @Column()
  originalname: string;

  @Column()
  postId: number;

  @Column()
  encoding: string;

  @Column('blob', { nullable: true, default: null })
  buffer: Buffer | null;

  @Column({ nullable: true })
  source?: string | null;

  @Column()
  size: number;
}
