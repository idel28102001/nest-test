import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { GetUser, UserPayload } from 'src/auth/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CreateChannelDto } from 'src/channels/dto/create-channel.dto';
import { PostChannelDto } from 'src/posts/dto/post-channel.dto';
import { UploadDto } from 'src/upload/dto/upload.dto';
import { addChannelDto } from '../dto/add-channel.dto';
import { editPhotoDto } from '../dto/edit-photo.dto';
import { editTitleDto } from '../dto/edit-title.dto';
import { ChannelService } from '../services/channel.service';

@Controller('channels')
export class ChannelController {
  constructor(
    private readonly channelService: ChannelService,
  ) {}


  @UseGuards(JwtAuthGuard)
  @Post('post') // Постим данные и файлы
  @UseInterceptors(FilesInterceptor('files'))
  async createPost(
    @UploadedFiles() content: Array<UploadDto>, // Получаем массив файлов
    @Body() dto: PostChannelDto, // Получаем данные по заголовку и описанию
    @GetUser() user: UserPayload,
  ) {
    return await this.channelService.makePost(
      user, dto, content
    );
  }


  @UseGuards(JwtAuthGuard)
  @Post('create') // Создаём канал
  async createChannel(
    @GetUser() user: UserPayload,
    @Body() dto: CreateChannelDto // Получаем описание желаемого канала
  ) {
    return await this.channelService.createChannel(user, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('title') // Изменяем заголовок канала
  async editTitle(
    @GetUser() user: UserPayload, 
    @Body() dto: editTitleDto // Получаем заголовок
  ) {
    return await this.channelService.editTitle(user, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id') // Удаляем канал по его ID в БД
  async deleteChannel(@Param('id') id: string, @GetUser() user: UserPayload) {
    return await this.channelService.deleteChannel(id, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllChannels(@GetUser() user: UserPayload) {
    return await this.channelService.getAllChannels(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('add')
  async addChannel(@Body() dto: addChannelDto, @GetUser() user: UserPayload) {
    return await this.channelService.addChannel(dto.channelId, user);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('photo'))
  @Post('edit-photo')
  async editPhoto(@GetUser() user: UserPayload, @UploadedFile() photo: UploadDto, @Body() dto: editPhotoDto) {
    return await this.channelService.editPhoto(user, photo, dto);
  }
}
