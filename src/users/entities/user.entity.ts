import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

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

  @Column({ default: 'user' })
  role: string;
}
