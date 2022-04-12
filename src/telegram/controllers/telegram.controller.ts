import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { GetUser, UserPayload } from 'src/auth/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CreateChannelDto } from '../dto/createChannel.dto';
import { TelegramAuthService } from '../services/telegram.auth.service';

@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramAuthService: TelegramAuthService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-channel')
  async createChannel(
    @GetUser() user: UserPayload, @Body() dto: CreateChannelDto
  ) {
    return await this.telegramAuthService.createChannel(user, dto);
  }
}
