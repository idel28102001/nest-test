import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateChannelDto } from 'src/telegram/dto/create-channel.dto';
import { Api, TelegramClient } from 'telegram';
import { FindOneOptions, Repository } from 'typeorm';
import * as BigInt from 'big-integer';
import { ChannelsEntity } from '../entities/channels.entitiy';
import { UploadDto } from 'src/uploadM/dto/upload.dto';
import { CustomFile } from 'telegram/client/uploads';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(ChannelsEntity)
    private readonly channelRepository: Repository<ChannelsEntity>
  ) {}

  create(data) {
    return this.channelRepository.create(data) as unknown as ChannelsEntity;
  }

  async save(data) {
    return await this.channelRepository.save(data) as unknown as ChannelsEntity;
  }

  async delete(id: string) {
    return await this.channelRepository.delete(id);
  }

  async findById(id: string, options?: FindOneOptions<ChannelsEntity>) {
    return await this.channelRepository.findOne(id, options);
  }

  async makeIdChannel(chanId: string, client: TelegramClient) {
    const id = BigInt(`${'-100'}${chanId}`);
    // '-100ID' - Отвечает за каналы или за большие группы
    // '-ID' - отвечает за малые группы
    // 'ID' - отвечает за пользователей
    try {
      return await client.getEntity(id) // Создаём id канала
    }
    catch (err) {
      throw new BadRequestException(err);
    }
  }

  async deleteChannel(id: string, client: TelegramClient) {
    const channelId = await this.makeIdChannel(id, client); // Создаём "Id-канала"
    try {
      return await client.invoke(new Api.channels.DeleteChannel({ channel: channelId })) // Меняем заголовок
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async createChannel(dto: CreateChannelDto, client: TelegramClient): Promise<Api.Updates> {
    const { title, about } = dto; // Для канала
    try {
      return (await client.invoke(new Api.channels.CreateChannel({ title, about }))) as unknown as Api.Updates; // Создаём канал
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async editTitle(title: string, id: string, client: TelegramClient) {
    const channelId = await this.makeIdChannel(id, client); // Создаём "Id-канала"
    try {
      return await client.invoke(new Api.channels.EditTitle({ channel: channelId, title })) // Меняем заголовок
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

 // async editPhoto(photo: UploadDto, id: string, client: TelegramClient) {
    // const channelId = await this.makeIdChannel(id, client); // Создаём "Id-канала"
    // const photoId = BigInt('-4156887774564');
    // const inputFile = new Api.
    //const filePhoto = new Api.InputChatUploadedPhoto({file: new Api.InputFile()});
    // try {
    //   return await client.invoke(new Api.channels.EditPhoto({
    //     channel: channelId, photo: filePhoto
    //   })) // Меняем фото
    // } catch (err) {
    //   throw new BadRequestException(err);
    // }
    // try {
    //   console.log(photo.size);
    //   console.log(photoId);
      // const result = await client.invoke(
      //   new Api.upload.SaveFilePart({
      //     fileId: BigInt("-4156887774564"),
      //     filePart: 1,
      //     bytes: photo.buffer,
      //   })
      // );
      //console.log(result); // prints the result
  //   } catch (err) {
  //     console.log(err);
  //     throw new BadRequestException(err);
  //   }
  // }
}
