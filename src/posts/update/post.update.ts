import { Action, Start, Update } from 'nestjs-telegraf';
import { Context } from 'vm';
import { Context as Ctx } from 'telegraf';
import { TelegramService } from '../../telegram/services/telegram.service';
import { PostsService } from '../services/posts.service';


@Update()
export class PostUpdate {
  constructor(
    private readonly postServices: PostsService,
    private readonly telegramService: TelegramService,
  ) { }

  @Start()
  async startCommand(ctx: Context) {
    await this.telegramService.addUser(ctx.message.chat.id);
    ctx.reply('Ждите новых сообщений.');
  }

  @Action(/^Read-\((.+)\)$/)
  async sendMess(ctx: Ctx) {
    const postId = (ctx as unknown as Context).match[1];
    await this.postServices.sendMessageToTGUser(ctx, postId);
  }

}
