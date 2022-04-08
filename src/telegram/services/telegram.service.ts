import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Context } from 'vm';
import { Context as Ctx } from 'telegraf';
import { Repository } from 'typeorm';
import { TelegramEntity } from '../entities/telegram.entity';
import { ContentEntity } from 'src/contents/entities/content.entity';
import { PostsService } from 'src/posts/services/posts.service';

@Injectable()
export class TelegramService {
  constructor(
    @InjectRepository(TelegramEntity)
    private readonly telegramRepository: Repository<TelegramEntity>,) { }

  async addUser(telegramId: number) {
    const user = await this.getByTelegramId(telegramId);
    if (!user) {
      this.telegramRepository.save({
        telegramId
      });
    }
  }

  async getByTelegramId(telegramId: number) {
    return await this.telegramRepository.findOne({ where: { telegramId } });
  }

  async getAllUsersTelegamId() {
    return (await this.telegramRepository.find()).map(e => e.telegramId);
  }
}
