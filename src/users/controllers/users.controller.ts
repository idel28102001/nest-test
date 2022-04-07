import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RegisterUserDto } from 'src/users/dto/register.user.dto';
import { UsersService } from 'src/users/services/users.service';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }
  @Post('register')
  @UsePipes(ValidationPipe)
  async register(@Body() dto: RegisterUserDto) {
    const result = await this.usersService.register(dto);
    return result;
  }
}