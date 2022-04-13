import { Body, Controller, Delete, Param, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser, UserPayload } from 'src/auth/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { UploadDto } from 'src/uploadM/dto/upload.dto';
import { CreateChannelDto } from '../dto/create-channel.dto';
import { editPhotoDto } from '../dto/edit-photo.dto';
import { editTitleDto } from '../dto/edit-title.dto';
import { TelegramChannelService } from '../services/telegram-channel.service';

@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramChannelService: TelegramChannelService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-channel')
  async createChannel(
    @GetUser() user: UserPayload, @Body() dto: CreateChannelDto
  ) {
    return await this.telegramChannelService.createChannel(user, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('edit-title')
  async editTitle(
    @GetUser() user: UserPayload, @Body() dto: editTitleDto
  ) {
    return await this.telegramChannelService.editTitle(user, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteChannel(@GetUser() user: UserPayload, @Param('id') id: string) {
    return await this.telegramChannelService.deleteChannel(user, id);
  }

  // @UseGuards(JwtAuthGuard)
  // @UseInterceptors(FileInterceptor('photo'))
  // @Post('edit-photo')
  // async editPhoto(@GetUser() user: UserPayload, @UploadedFile() photo: UploadDto, @Body() dto: editPhotoDto) {
  //   return await this.telegramChannelService.editPhoto(user, photo, dto);
  // }
}
