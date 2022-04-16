import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfirmPhoneDto } from 'src/auth/dto/confirmPhone.dto';
import { UsersService } from 'src/users/services/users.service';
import { Api } from 'telegram';
import { TelegramService } from './telegram.service';

@Injectable()
export class TelegramAuthService {
  constructor(private readonly service: TelegramService,
    private readonly usersService: UsersService, // Для доступа к пользователям
  ) {}

  async sendCode(phone: string | undefined) {
    const client = await this.service.getTelegramClient(phone); // Создаём(получаем) клиента
    try {
      const { phoneCodeHash } = await client.sendCode({
        apiId: client.apiId, apiHash: client.apiHash
      }, phone); // Отправляем в телеграм клиента код
      const user = await this.usersService.getOrCreate({ phoneCodeHash, phone }); // Получим(создадим) сущность с хешем кода
      return await this.usersService.save(user); // Сохранем хеш кода в базу и возвращаем сущность
    }
    catch (e) {
      throw new BadRequestException(e);
    }
  }

  async confirmPhone(dto: ConfirmPhoneDto) {
    const user = await this.usersService.findByPhone(dto.phone, { select: ['phone', 'phoneCodeHash', 'id'] }); // Получаем сущность пользователя 
    const client = await this.service.getTelegramClient(user.phone); // Создаём(получаем) клиента
    try {
      await client.invoke(
        new Api.auth.SignIn({ phoneNumber: user.phone, phoneCodeHash: user.phoneCodeHash, phoneCode: dto.code })
      ) // Аутентифицируемся с кодом из телеграм
      const session = (client.session.save() as unknown as string); // Получаем сессиию
      user.telegramSession = session; // Добавляем в сущность пользователя
      return await this.usersService.save(user); // Сохраняем и возвращаем сущность
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
