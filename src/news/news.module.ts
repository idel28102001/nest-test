import { Module } from '@nestjs/common';
import { NewsService } from './services/news/news/news.service';
import { NewsController } from './controllers/news/news/news.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import entities from 'src/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  providers: [NewsService],
  controllers: [NewsController],
})
export class NewsModule {}
