import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class NewsEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', default: Date.now() })
  postedAt: number;

  @Column({ default: false })
  owner: boolean;

  @Column({ nullable: false })
  userId: number;

  @Column('text')
  description = '';

  @Column({ nullable: false })
  username: string;
}
