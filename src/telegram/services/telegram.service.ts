import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Context } from 'vm';
import { Repository } from 'typeorm';
import { TelegramEntity } from '../entities/telegram.entity';
import { PostsEntity } from 'src/news/entities/posts.entity';
import { ContentEntity } from 'src/news/entities/content.entity';
import { ConfigFactory, ConfigService } from '@nestjs/config';

@Injectable()
export class TelegramService {
  constructor(
    @InjectRepository(TelegramEntity)
    private readonly telegramRepository: Repository<TelegramEntity>,
    private configService: ConfigService //i'll show an example 
  ) {

    /**
     * We now have access to all config keys from the config service ..
     * if you need as example the SECRET 
     * this.configService.get('SECRET');
     * but using configService outside classes are not a part of a module . WILL NOT WORK
     * and you will need to install dotenv lib , and do some extra stuff..
     * i also can provice an example for that . I worked with dotenv, thanks.))))
     * Thanks for explaination .
     * 
     * importing configService doesn't need to create an instance of it 
     */
  }

  async addUser(telegramId: number) {
    const user = await this.getByTelegramId(telegramId);
    if (!user) {
      this.telegramRepository.save({
        telegramId
      });
    }
  }

  async sendMessage(ctx: Context, post: PostsEntity & { content: ContentEntity[] }) {
    await this.sendMedias(ctx, post.content);
    await ctx.reply(post.description);
    await ctx.replyWithPoll('Как вам пост?', ['Нравится', 'Не нравится', 'Посмотреть результаты'], { allows_multiple_answers: false, is_anonymous: true });
  }

  async sendMedias(ctx: Context, content: ContentEntity[]) {
    await Promise.all(this.createMediaPromises(ctx, content));
  }

  createMediaPromises(ctx: Context, content: ContentEntity[]) {
    return content.map(cnt => {
      const currType = cnt.mimetype.split('/')[0];
      switch (currType) {
        case 'image': {
          return ctx.replyWithPhoto({ source: cnt.buffer });
        }
        case 'audio': {
          return ctx.replyWithAudio({ source: cnt.buffer });
        }
        case 'video': {
          return ctx.replyWithVideo({ source: cnt.source });
        }
      }
    });
  }

  async getByTelegramId(telegramId: number) {
    return await this.telegramRepository.findOne({ where: { telegramId } });
  }
}
