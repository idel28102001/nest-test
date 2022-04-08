import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentEntity } from './entities/content.entity';
import { ContentsService } from './services/contents.service';

@Module({
  imports: [TypeOrmModule.forFeature([ContentEntity])],
  providers: [ContentsService],
  exports: [ContentsService],
})
export class ContentsModule { }
