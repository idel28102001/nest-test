import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { PostsEntity } from 'src/posts/entities/posts.entity';
import { Role } from '../enums/role.enum';
import { ChannelsEntity } from 'src/channels/entities/channels.entitiy';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  phone: string;

  @Column({ type: 'enum', array: true, enum: Role, default: [Role.USER] })
  roles: Role[];

  @OneToMany(() => ChannelsEntity, channel => channel.user, { cascade: true })
  channels: ChannelsEntity[];

  @Column({
    nullable: false,
    default: '',
  })
  username: string;

  @Column({ nullable: false, default: '', select: false })
  password: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      const salt = bcrypt.genSaltSync(10, 'a');
      this.password = bcrypt.hashSync(this.password, salt);
    }
  }

  @Column({ nullable: true, select: false })
  telegramSession: string;

  @Column({ nullable: true, select: false })
  phoneCodeHash: string;

  @Column({ nullable: true, select: false })
  telegramCode: string;
}
