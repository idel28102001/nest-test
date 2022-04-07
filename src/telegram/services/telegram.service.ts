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
    ctx.reply(post.description);
    ctx.replyWithPoll('Как вам пост?', ['Нравится', 'Не нравится', 'Посмотреть результаты'], { allows_multiple_answers: false, is_anonymous: true });
  }

  async sendMedias(ctx: Context, content: ContentEntity[]) {
    content.forEach(cnt => {
      const currType = cnt.mimetype.split('/')[0];
      switch (currType) {
        case 'image': {
          ctx.replyWithPhoto({ source: cnt.buffer });
          break;
        }
        case 'audio': {
          ctx.replyWithAudio({ source: cnt.buffer });
          break;
        }
        case 'video': {
          ctx.replyWithVideo({ source: cnt.source });
          break;
        }
      }
    });
  }

  async getByTelegramId(telegramId: number) {
    return await this.telegramRepository.findOne({ where: { telegramId } });
  }
}
