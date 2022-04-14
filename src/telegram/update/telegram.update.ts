// import { Action, Start, Update } from 'nestjs-telegraf';
// import { Context } from 'vm';
// import { Context as Ctx } from 'telegraf';
// import { TelegramService } from '../services/telegram-chatBot.service';
// import { PostsService } from 'src/posts/services/posts.service';


// @Update()
// export class TelegramUpdate {
//   constructor(
//     private readonly postServices: PostsService,
//     private readonly telegramService: TelegramService,
//   ) {}

//   @Start()
//   async startCommand(ctx: Context) {
//     await this.telegramService.addUser(ctx.message.chat.id);
//     ctx.reply('Ждите новых сообщений.');
//   }

//   @Action(/^Read-\((.+)\)$/)
//   async sendMess(ctx: Ctx) {
//     const postId = (ctx as unknown as Context).match[1];
//     await this.postServices.sendMessageToTGUser(ctx, postId);
//   }

// }
