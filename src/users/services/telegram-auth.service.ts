import {
  Controller,
} from '@nestjs/common';
import { TelegramAuthService } from 'src/telegram/services/telegram-auth.service';

@Controller('user')
export class UsersController {
  constructor(private readonly telegramAuthService: TelegramAuthService) {}


  // @Post('send-code')
  // async sendCode(@Body() data: SendCodeDto) {
  //   return await this.telegramAuthService.sendCode(data.phone);
  // }

  // @Post('confirm-phone')
  // async confirmPhone(@Body() dto: ConfirmPhoneDto) {
  //   return await this.telegramAuthService.confirmPhone(dto);
  // }

}
