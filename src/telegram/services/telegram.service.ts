import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { config } from 'src/common/config';
import { PostDto } from 'src/posts/dto/post.dto';
import { Markup, Telegraf } from 'telegraf';
import { Repository } from 'typeorm';
import { TelegramEntity } from '../entities/telegram.entity';

@Injectable()
export class TelegramService {
  constructor(
    @InjectRepository(TelegramEntity)
    private readonly telegramRepository: Repository<TelegramEntity>,) {}
  private app = new Telegraf(config.telegramToken());

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

  async sendAllUsers(users: number[], post: PostDto, postId: string) {
    await Promise.all(users.map(e => this.app.telegram.sendMessage(e, `<b>${post.title}</b>\n${post.announcement}`, {
      parse_mode: 'HTML', ...Markup.inlineKeyboard([
        Markup.button.callback('Читать полностью...', `Read-(${postId})`),
      ])

    })));
  }
}
