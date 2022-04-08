import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegramEntity } from './entities/telegram.entity';
import { TelegramService } from './services/telegram.service';
import { ContentsModule } from 'src/contents/contents.module';

@Module({
  imports: [TypeOrmModule.forFeature([TelegramEntity]), ContentsModule],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramModule { }
