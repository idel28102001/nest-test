import { Action, Start, Update } from 'nestjs-telegraf';
import { NewsService } from 'src/news/services/news.service';
import { Context } from 'vm';
import { TelegramService } from '../services/telegram.service';


@Update()
export class AppUpdate {
  constructor(private readonly telegramServices: TelegramService, private readonly newsService: NewsService) { }

  @Start()
  async startCommand(ctx: Context) {
    await this.telegramServices.addUser(ctx.message.chat.id);
    ctx.reply('Ждите новых сообщений.');
  }

  @Action(/^Read-([0-9]+)$/)
  async sendMess(ctx: Context) {
    const postId = parseInt(ctx.match[1]);
    const post = await this.newsService.getPostById(postId);
    await this.telegramServices.sendMessage(ctx, post);
  }

}
