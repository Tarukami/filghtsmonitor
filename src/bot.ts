import { Bot } from "grammy";

const { TG_BOT_TOKEN } = process.env;

if (!TG_BOT_TOKEN) throw new Error("No telegram bot token provided");

const bot = new Bot(TG_BOT_TOKEN);

bot.on("message", async (ctx) => {
  try {
    console.log(ctx.chatId);
    const { text } = ctx.message;
    const reply = text.toLowerCase() === "пинг" ? "понг" : "это не пинг";
    await ctx.reply(reply);
  } catch (e) {
    await ctx.reply("Ты что хочешь бота сломать?");
  }
});

//Start the Bot
bot.start().catch((e) => console.log(e)); // TODO: consider switching to @grammyjs/runner
console.log("bot started..");

export { bot };
