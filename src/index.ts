#!/usr/bin/env bun

import { Command } from "commander";
import { runWakeup } from "./ui/wakeup";

const program = new Command();

program
  .name("KRYPTON")
  .description("Think. Act. Automate.")
  .version("1.0.0");

program
  .command("wakeup")
  .description("Show the banner and pick AI or Telegram mode")
  .action(async () => {
    await runWakeup({});
  });

program
  .command("start")
  .description("Quick start - alias for wakeup")
  .action(async () => {
    await runWakeup({});
  });

await program.parseAsync(process.argv);
