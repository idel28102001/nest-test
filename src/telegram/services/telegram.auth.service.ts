import { BadRequestException, Injectable } from '@nestjs/common';
import { UserPayload } from 'src/auth/decorators/get-user.decorator';
import { ConfirmPhoneDto } from 'src/users/dto/confirmPhone.dto';
import { UsersService } from 'src/users/services/users.service';
import { Api } from 'telegram';
import { StringSession } from 'telegram/sessions';
import { CreateChannelDto } from '../dto/createChannel.dto';
import { TelegramService } from './telegram.service';

@Injectable()
export class TelegramAuthService {
  constructor(private readonly service: TelegramService,
    private readonly usersService: UsersService
  ) {}

  async sendCode(phone: string | undefined) {
    const client = await this.service.getTelegramClient(phone);
    try {
      const { phoneCodeHash } = await client.sendCode({
        apiId: client.apiId, apiHash: client.apiHash
      }, phone);
      const user = await this.usersService.getOrCreate({ phoneCodeHash, phone });
      return await this.usersService.save(user);
    }
    catch (e) {
      console.log(e);
      throw new BadRequestException(e);
    }
  }

  async confirmPhone(dto: ConfirmPhoneDto) {
    const user = await this.usersService.findByPhone(dto.phone, { select: ['phone', 'phoneCodeHash', 'id'] });
    const client = await this.service.getTelegramClient(user.phone);
    try {
      await client.invoke(
        new Api.auth.SignIn({ phoneNumber: user.phone, phoneCodeHash: user.phoneCodeHash, phoneCode: dto.code })
      )
      const session = (client.session.save() as unknown as string);
      user.telegramSession = session;
      return await this.usersService.save(user);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async createChannel(userPayload: UserPayload, dto: CreateChannelDto) {
    const { title, about, address } = dto;
    const { telegramSession, phone } = await this.usersService.findById(userPayload.userId, { select: ['telegramSession', 'phone'] });
    const client = await this.service.getTelegramClient(phone, telegramSession);

    try {
      const result = await client.invoke(new Api.channels.CreateChannel({
        title, about, address, megagroup: true, forImport: true, geoPoint: new Api.InputGeoPoint({
          lat: 8.24,
          long: 8.24,
          accuracyRadius: 43,
        })
      }));
      console.log(result);
    } catch (e) {
      console.log(e);
      throw new BadRequestException(e);
    }
  }
}
