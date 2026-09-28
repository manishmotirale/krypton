import { text, isCancel } from "@clack/prompts";
import chalk from "chalk";
import { defaultAgentConfig } from "./types";
import { ActionTracker } from "./action-tracker";
import { ToolExecutor } from "./tool-executor";
import { createAgentTools } from "./agent-tools";
import { stepCountIs, ToolLoopAgent } from "ai";
import { getAgentModel } from "../../core/ai/ai.config";
import { renderTerminalMarkdown } from "../../ui/terminal-md";
import { runApprovalFlow } from "./approval";

export async function runAgentMode() {
  console.log(chalk.bold("\n🤖 Agent Mode\n"));

  const goal = await text({
    message: "What would you like to do?",
    placeholder: "Enter your goal here...",
  });

  if (isCancel(goal) || !goal.trim()) return;

  const config = defaultAgentConfig();
  const tracker = new ActionTracker();
  const executor = new ToolExecutor(tracker, config);
  const tools = createAgentTools(executor);

  const agent = new ToolLoopAgent({
    model: getAgentModel(),
    stopWhen: stepCountIs(40),
    instructions: [
      `Workspace root: ${config.codebasePath}`,
      `All Mutations are staged untill approval`,
    ].join("\n"),
    tools,
  });

  const result = await agent.generate({
    prompt: goal.trim(),
    onStepFinish: ({ toolCalls }) => {
      for (const call of toolCalls) {
        const preview = JSON.stringify(call.input).slice(0, 160);

        console.log(
          chalk.green(" ✓ "),
          chalk.bold(call.toolName),
          chalk.dim(preview + (preview.length >= 160 ? " ..." : "")),
        );
      }
    },
  });

  if (result.text?.trim()) {
    console.log(renderTerminalMarkdown(result.text));
  }

  const ok = await runApprovalFlow(tracker);
  if (!ok) return executor.clearStagging();

  const { errors } = executor.applyApprovedFromTracker();
  if (errors.length) {
    console.log(chalk.red("\n Some Operations reported errors:\n"));
    for (const error of errors) {
      console.log(chalk.red(" - " + error));
    }
  } else {
    console.log(chalk.green("\n All Operations Applied!\n"));
  }

  executor.clearStagging();
}
