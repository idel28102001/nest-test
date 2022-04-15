import { Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class UploadEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: true,
  })
  mimetype: string;

  @Column()
  originalname: string;

  @Column({ default: '' })
  url: string;

  @Column({ default: '' })
  dir: string;

  @Column({default: 0})
  size: number;
}