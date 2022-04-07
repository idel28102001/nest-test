import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'telegram_users' })
export class TelegramEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column('bigint')
  telegramId: number;
}