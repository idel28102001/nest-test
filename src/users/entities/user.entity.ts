import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RolesEntity } from '../../roles/entities/roles.entity';
import { PostsEntity } from 'src/posts/entities/posts.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  @OneToMany(type => PostsEntity, post => post.userId)
  @OneToMany(type => RolesEntity, role => role.userId)
  id: string;

  @Column({
    nullable: false,
    default: '',
  })
  username: string;

  @Column({ nullable: false, default: '' })
  password: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      const salt = bcrypt.genSaltSync(10, 'a');
      this.password = bcrypt.hashSync(this.password, salt);
    }
  }
}
