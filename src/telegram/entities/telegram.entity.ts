import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'telegram_users' })
export class TelegramEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column('bigint')
  telegramId: number;
}
