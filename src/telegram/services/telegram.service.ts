import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { config } from 'src/common/config';
import { Markup, Telegraf } from 'telegraf';
import { StringSession } from 'telegram/sessions';
import { TelegramClient } from 'telegram';
import { Repository } from 'typeorm';
import { TelegramEntity } from '../entities/telegram.entity';
import * as BigInt from 'big-integer';
import { PostChannelDto } from 'src/posts/dto/post-channel.dto';

@Injectable()
export class TelegramService {
  constructor(
    @InjectRepository(TelegramEntity)
    private readonly telegramRepository: Repository<TelegramEntity>,) {}

  private clients: Map<string, TelegramClient> = new Map()



  async makeIdChannel(chanId: string, client: TelegramClient) {
    const id = BigInt(`${'-100'}${chanId}`);
    // '-100ID' - Отвечает за каналы или за большие группы
    // '-ID' - отвечает за малые группы
    // 'ID' - отвечает за пользователей
    try {
      return await client.getEntity(id) // Создаём id канала
    }
    catch (err) {
      throw new BadRequestException(err);
    }
  }


  async getTelegramBot(session = '') {
    const token = config.telegramToken();
    if (this.clients.has(token)) return this.clients.get(token); // Возвращаем клиента, если таковой - есть
    const telegramConfig = config.getTelegramConfig();// Получаем конфиг от приложения телеграма
    const stringSession = new StringSession(session);// Создаём сессию
    const client = new TelegramClient(
      stringSession,
      telegramConfig.apiId,
      telegramConfig.apiHash,
      { connectionRetries: 5 }
    )
    this.clients.set(token, client); // Сохраняем в "базу"
    await client.start({ botAuthToken: token });// Конектимся
    return client;// Вовзращаем
  }


  async getTelegramClient(phone: string, session = '') {
    if (this.clients.has(phone)) return this.clients.get(phone); // Возвращаем клиента, если таковой - есть
    const telegramConfig = config.getTelegramConfig(); // Получаем конфиг от приложения телеграма
    const stringSession = new StringSession(session); // Создаём сессию
    const client = new TelegramClient( // Создаем клиента
      stringSession,
      telegramConfig.apiId,
      telegramConfig.apiHash,
      { connectionRetries: 5 }
    )
    this.clients.set(phone, client); // Сохраняем в "базу"
    await client.connect() // Конектимся
    return client; // Вовзращаем
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

  async sendAllUsers(users: number[], post: PostChannelDto, postId: string) {
    await Promise.all(users.map(e => this.app.telegram.sendMessage(e, `<b>${post.title}</b>\n${post.description}`, {
      parse_mode: 'HTML', ...Markup.inlineKeyboard([
        Markup.button.callback('Читать полностью...', `Read-(${postId})`),
      ])

    })));
  }
}
