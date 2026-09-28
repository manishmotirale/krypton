import { Telegraf } from "telegraf";
import chalk from "chalk";
import { WELCOME } from "./constants";
import { registerHandlers } from "./handlers";

export async function runTelegramMode() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const ownerId = process.env.TELEGRAM_OWNER_ID;

    if (!token || !ownerId) {
        console.error(chalk.red("\n❌ Telegram Configuration Missing:\n"));
        console.error(chalk.red("  • TELEGRAM_BOT_TOKEN is required"));
        console.error(chalk.red("  • TELEGRAM_OWNER_ID is required\n"));
        console.error(chalk.yellow("💡 Add these to your .env file to use Telegram mode.\n"));
        return;
    }

    const bot = new Telegraf(token);

    registerHandlers(bot);

    await bot.telegram.sendMessage(ownerId, WELCOME, { parse_mode: "Markdown" });
    console.log(chalk.green("Sent Welcome Message successfully to Telegram!"));

    bot.launch();
    console.log(chalk.green("Telegram Bot launched successfully. Press Ctrl+C to stop!"));

    await new Promise<void>((resolve) => {
        const stop = () => {
            bot.stop("SIGINT");
            resolve();
        }
        process.on("SIGINT", stop);
        process.on("SIGTERM", stop);
    });
}
