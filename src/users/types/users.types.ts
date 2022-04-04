import { Exclude } from 'class-transformer';

export class SerialiedUser {
  id: number;
  username: string;
  @Exclude()
  password: string;

  constructor(partial: Partial<SerialiedUser>) {
    Object.assign(this, partial);
  }
}
