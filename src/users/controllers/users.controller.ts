import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser, UserPayload } from 'src/auth/decorators/get-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { TelegramAuthService } from 'src/telegram/services/telegram.auth.service';
import { TelegramService } from 'src/telegram/services/telegram.service';
import { RegisterUserDto } from 'src/users/dto/register.user.dto';
import { UsersService } from 'src/users/services/users.service';
import { ConfirmPhoneDto } from '../dto/confirmPhone.dto';
import { SendCodeDto } from '../dto/send-code.dto';
import { Role } from '../enums/role.enum';
import { UsernameUniquePipe } from '../pipes/username.unique.pipe';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService,
    private readonly telegramAuthService: TelegramAuthService) {}
  @Post('register')
  async register(@Body(UsernameUniquePipe) dto: RegisterUserDto) {
    return await this.usersService.register(dto);
  }

  @Get('profile')
  @Roles(Role.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  getProfile(@GetUser() user: UserPayload) {
    return user;
  }

  @Post('send-code')
  async sendCode(@Body() data: SendCodeDto) {
    return await this.telegramAuthService.sendCode(data.phone);
  }

  @Post('confirm-phone')
  async confirmPhone(@Body() dto: ConfirmPhoneDto) {
    return await this.telegramAuthService.confirmPhone(dto);
  }


  @Delete()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteProfile(@Body() dto: { username: string }) {
    return await this.usersService.delete(dto.username);
  }
}
