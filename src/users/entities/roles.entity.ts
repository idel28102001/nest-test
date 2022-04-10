import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'roles' })
export class RolesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'user' })
  role: string;

  @ManyToOne(() => UserEntity, (user) => user.roles, {
    onDelete: 'CASCADE'
  })
  user: UserEntity;
}
