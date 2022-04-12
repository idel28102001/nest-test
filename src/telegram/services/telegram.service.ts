import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { config } from 'src/common/config';
import { PostDto } from 'src/posts/dto/post.dto';
import { Markup, Telegraf } from 'telegraf';
import { StringSession } from 'telegram/sessions';
import { TelegramClient } from 'telegram';
import { Repository } from 'typeorm';
import { TelegramEntity } from '../entities/telegram.entity';

@Injectable()
export class TelegramService {
  constructor(
    @InjectRepository(TelegramEntity)
    private readonly telegramRepository: Repository<TelegramEntity>,) {}

  private clients: Map<string, TelegramClient> = new Map()

  async getTelegramBot(session = '') {
    const telegramConfig = config.getTelegramConfig();
    const token = config.telegramToken();
    const stringSession = new StringSession(session);
    const client = new TelegramClient(
      stringSession,
      telegramConfig.apiId,
      telegramConfig.apiHash,
      { connectionRetries: 5 }
    )
    await client.start({ botAuthToken: token });
    return client;
  }


  async getTelegramClient(phone: string, session = '') {
    if (this.clients.has(phone)) return this.clients.get(phone);
    const telegramConfig = config.getTelegramConfig();
    const stringSession = new StringSession(session);
    const client = new TelegramClient(
      stringSession,
      telegramConfig.apiId,
      telegramConfig.apiHash,
      { connectionRetries: 5 }
    )
    this.clients.set(phone, client);
    await client.connect()
    return client;
  }



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
