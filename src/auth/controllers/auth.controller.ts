import {
  Body,
  Controller,
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
  @Post('login')
  async login(@Body() data: LoginDto) {
    return await this.authService.login(data);
  }
  @Post('make-admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  async makeAdmin(
    @Body() dto: AdminDto,
    @GetUser() user: UserPayload) {
    return await this.authService.makeAdmin(user.userId, dto.secret);
  }

  @Post('unmake-admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async unmakeAdmin(@Body(HasAdminPipe) dto: { username: string }) {
    return await this.authService.unmakeAdmin(dto);
  }



  @Post('send-code')
  async sendCode(@Body() data: SendCodeDto) {
    return await this.telegramAuthService.sendCode(data.phone);
  }

  @Post('confirm-phone')
  async confirmPhone(@Body() dto: ConfirmPhoneDto) {
    return await this.telegramAuthService.confirmPhone(dto);
  }
}
