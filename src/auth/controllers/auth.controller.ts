import {
  Body,
  Controller,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { AuthService } from 'src/auth/services/auth.service';
import { TelegramAuthService } from 'src/telegram/services/telegram-auth.service';
import { Role } from 'src/users/enums/role.enum';
import { HasAdminPipe } from 'src/users/pipes/hasAdmin.pipe';
import { GetUser, UserPayload } from '../decorators/get-user.decorator';
import { Roles } from '../decorators/roles.decorator';
import { AdminDto } from '../dto/admin.dto';
import { ConfirmPhoneDto } from '../dto/confirmPhone.dto';
import { LoginDto } from '../dto/login.dto';
import { SendCodeDto } from '../dto/send-code.dto';
import { LocalAuthGuard } from '../guard/local-auth.guard';
import { RolesGuard } from '../guard/roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly telegramAuthService: TelegramAuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login') // Входим(получаем JWT ключ)
  async login(@Body() data: LoginDto) {
    return await this.authService.login(data);
  }


  @Post('make-admin') //Становимся админом
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN) // Проверка на роль
  async makeAdmin(
    @Body() dto: AdminDto,
    @GetUser() user: UserPayload) {
    return await this.authService.makeAdmin(user.userId, dto.secret);
  }

  @Post('unmake-admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN) // Удаляем роль у пользователя по его id
  async unmakeAdmin(@Param('id',HasAdminPipe) id: string) {
    return await this.authService.unmakeAdmin(id);
  }



  @Post('send-code') // Отправляем код подтверждения
  async sendCode(@Body() data: SendCodeDto) { //Передаём нужно данные для отправки
    return await this.telegramAuthService.sendCode(data.phone);
  }

  @Post('confirm-phone') // Подтверждаем телефон по его коду
  async confirmPhone(@Body() dto: ConfirmPhoneDto) {
    return await this.telegramAuthService.confirmPhone(dto);
  }
}
