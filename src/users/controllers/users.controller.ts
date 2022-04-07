import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser, UserPayload } from 'src/auth/decorators/get-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { RegisterUserDto } from 'src/users/dto/register.user.dto';
import { UsersService } from 'src/users/services/users.service';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }
  @Post('register')
  async register(@Body() dto: RegisterUserDto) {
    return await this.usersService.register(dto);
  }

  @Get('profile')
  @Roles(Role.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  getProfile(@GetUser() user: UserPayload) {
    return user;
  }
}
