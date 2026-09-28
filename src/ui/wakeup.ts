import { select, isCancel } from "@clack/prompts";
import chalk from "chalk";
import figlet from "figlet";
import { runCliMode } from "../modes/cli";
import { runTelegramMode } from "../modes/telegram";

const BANNER_FONT = "ANSI Shadow";

// Main colors
const FACE = chalk.hex("#EDE7FF").bold;
const PURPLE = chalk.hex("#8B5CF6");
const BLUE = chalk.hex("#38BDF8");
const CYAN = chalk.hex("#22D3EE");

// Subtle shadow colors
const SHADOW_DARK = chalk.hex("#31205F");
const SHADOW_LIGHT = chalk.hex("#5B4D9E");

function printBannerWithShadow(ascii: string) {
  const bannerLines = ascii.replace(/\s+$/, "").split("\n");

  // Remove completely empty lines
  const lines = bannerLines.filter((line) => line.trim().length > 0);
  for (const line of lines) {
    console.log(SHADOW_DARK(` ${line}`));
  }

  process.stdout.write(`\x1b[${lines.length}A`);

  for (const line of lines) {
    console.log(SHADOW_LIGHT(` ${line}`));
  }

  process.stdout.write(`\x1b[${lines.length}A`);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    let coloredLine;

    if (i < lines.length / 3) {
      coloredLine = CYAN(line);
    } else if (i < (lines.length * 2) / 3) {
      coloredLine = BLUE(line);
    } else {
      coloredLine = PURPLE(line);
    }

    console.log(FACE(coloredLine));
  }

  console.log();
}

export async function runWakeup(params: unknown) {
  let ascii: string;

  try {
    ascii = figlet.textSync("KRYPTON", {
      font: BANNER_FONT,
      horizontalLayout: "default",
      verticalLayout: "default",
    });
  } catch (error) {
    ascii = figlet.textSync("KRYPTON", {
      font: "Standard",
    });
  }

  printBannerWithShadow(ascii);

  const mode = await select({
    message: "Which mode do you want to use?",
    options: [
      { value: "cli", label: "AI Mode (CLI)" },
      { value: "telegram", label: "Telegram Mode (Bot)" },
      { value: "exit", label: "Exit" },
    ],
  });

  if (isCancel(mode) || mode === "exit") {
    console.log(chalk.dim("Exiting..."));
    return;
  }

  if (mode === "cli") {
    await runCliMode();
  } else if (mode === "telegram") {
    await runTelegramMode();
  }
}
