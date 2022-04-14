import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { ChannelsEntity } from '../entities/channels.entitiy';

@Injectable()
export class ChannelRepService {
  constructor(
    @InjectRepository(ChannelsEntity)
    private readonly channelRepository: Repository<ChannelsEntity>,
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
    const res = await this.channelRepository.findOne(id, options);
    if (!res) throw new NotFoundException()
    return res;
  }

}