import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { TelegramEntity } from './entities/telegram.entity';

import { TelegramService } from './services/telegram.service';


@Module({
  imports: [TypeOrmModule.forFeature([TelegramEntity])],

  providers: [TelegramService],

  exports: [TelegramService],
})
export class TelegramModule { }
