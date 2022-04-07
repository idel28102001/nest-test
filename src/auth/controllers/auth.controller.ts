import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { AuthService } from 'src/auth/services/auth.service';
import { userIdTypes } from 'src/users/types/userId.types';
import { adminDto } from '../dto/admin.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  @UsePipes(ValidationPipe)
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('make-admin')
  @UsePipes(ValidationPipe)
  async makeAdmin(@Body() dto: adminDto, @Req() req) {
    const { userId } = req.user as unknown as userIdTypes;
    await this.authService.makeAdmin(userId, dto.secret);

  }
}
