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

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', array: true, enum: Role, default: [Role.USER]})
  roles: Role[];

  @OneToMany(() => PostsEntity, (post) => post.user, {
    cascade: true,
  })
  posts: PostsEntity[];

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
