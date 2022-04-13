import { UserEntity } from 'src/users/entities/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('channels')
export class ChannelsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  channelId: string;

  @Column({nullable: true})
  title: string;

  @Column('text', {default: '', nullable: true})
  description: string;

  @ManyToOne(() => UserEntity, user => user.channels, { 'onDelete': 'SET NULL' })
  user: UserEntity;

}