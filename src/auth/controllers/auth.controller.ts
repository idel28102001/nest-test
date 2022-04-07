import {
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { AuthService } from 'src/auth/services/auth.service';

import { GetUser, UserPayload } from '../decorators/get-user.decorator';
import { Roles } from '../decorators/roles.decorator';
import { AdminDto } from '../dto/admin.dto';
import { LoginDto } from '../dto/login.dto';
import { Role } from '../enums/role.enum';
import { LocalAuthGuard } from '../guard/local-auth.guard';
import { RolesGuard } from '../guard/roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() data: LoginDto) {
    return await this.authService.login(data);
  }
  @Post('make-admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  async makeAdmin(
    @Body() dto: AdminDto,
    @GetUser() user: UserPayload) {
    await this.authService.makeAdmin(user.userId, dto.secret);
  }
}
