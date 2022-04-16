import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { config } from 'src/common/config';
import { StringSession } from 'telegram/sessions';
import { TelegramClient } from 'telegram';
import * as BigInt from 'big-integer';
import { UserPayload } from 'src/auth/decorators/get-user.decorator';

@Injectable()
export class TelegramService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  private clients: Map<string, TelegramClient> = new Map()


  async preparePropertiesForChannel(chId: string, userPayload: UserPayload) {  // Подготовим клиент и сам "ссылку" на канал
    const { phone, telegramSession } = userPayload; // Разархивируем телефон и сессию
    const client = await this.getTelegramClient(phone, telegramSession); // Получаем клиента
    const peer = await this.makeIdChannel(chId, client); // Получаем ссылку
    return { client, peer } // Возвращаем
  }

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

  async getTelegramClient(phone: string, session = '') {
    let client: TelegramClient;
    if (this.clients.has(phone)) {
      client = this.clients.get(phone)
    } // Записываем если таковой - есть
    else {
      const telegramConfig = config.getTelegramConfig(); // Получаем конфиг от приложения телеграма
      const stringSession = new StringSession(session); // Создаём сессию
      client = new TelegramClient( // Создаем клиента
        stringSession,
        telegramConfig.apiId,
        telegramConfig.apiHash,
        { connectionRetries: 5 }
      )
      this.clients.set(phone, client); // Сохраняем в "базу"
    }
    await client.connect() // Конектимся
    if (!await client.checkAuthorization() && session) { // Проверяем - действительна ли сессия
      this.clients.delete(phone); //Удаляем из базы
      throw new UnauthorizedException('Сессия недействительна');
    }
    return client; // Вовзращаем
  }
}
