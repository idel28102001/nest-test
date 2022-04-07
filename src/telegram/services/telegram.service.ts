import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Context } from 'vm';
import { Repository } from 'typeorm';
import { TelegramEntity } from '../entities/telegram.entity';
import { PostsEntity } from 'src/news/entities/posts.entity';
import { ContentEntity } from 'src/news/entities/content.entity';

@Injectable()
export class TelegramService {
  constructor(@InjectRepository(TelegramEntity) private readonly telegramRepository: Repository<TelegramEntity>) { }

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
