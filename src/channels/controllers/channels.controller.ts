import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { GetUser, UserPayload } from 'src/auth/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CreateChannelDto } from 'src/channels/dto/create-channel.dto';
import { PostChannelDto } from 'src/posts/dto/post-channel.dto';
import { UploadDto } from 'src/uploadM/dto/upload.dto';
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
  @Post('post')
  @UseInterceptors(FilesInterceptor('files'))
  async createPost(
    @UploadedFiles() content: Array<UploadDto>,
    @Body() dto: PostChannelDto,
    @GetUser() user: UserPayload,
  ) {
    return await this.channelService.makePost(
      dto, content,
      user,
    );
  }


  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createChannel(
    @GetUser() user: UserPayload, @Body() dto: CreateChannelDto
  ) {
    return await this.channelService.createChannel(user, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('title')
  async editTitle(
    @GetUser() user: UserPayload, @Body() dto: editTitleDto
  ) {
    return await this.channelService.editTitle(user, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteChannel(@GetUser() user: UserPayload, @Param('id') id: string) {
    return await this.channelService.deleteChannel(user, id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllChannels(@GetUser() user: UserPayload) {
    return await this.channelService.getAllChannels(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('add')
  async addChannel(@GetUser() user: UserPayload, @Body() dto: addChannelDto) {
    return await this.channelService.addChannel(user, dto.channelId);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('photo'))
  @Post('edit-photo')
  async editPhoto(@GetUser() user: UserPayload, @UploadedFile() photo: UploadDto, @Body() dto: editPhotoDto) {
    return await this.channelService.editPhoto(user, photo, dto);
  }
}
