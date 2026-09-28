import chalk from "chalk";
import { confirm, isCancel, text } from "@clack/prompts";
import { ToolLoopAgent, stepCountIs, tool } from "ai";
import { z } from "zod";
import { getAgentModel } from "../../core/ai/ai.config";
import { ActionTracker } from "../agent/action-tracker";
import { ToolExecutor } from "../agent/tool-executor";
import { defaultAgentConfig } from "../agent/types";
import { renderTerminalMarkdown } from "../../ui/terminal-md";
import { runApprovalFlow } from "../agent/approval";
import { createWebTools } from "../plan/web-tools";

function createAskTools(executor: ToolExecutor) {
  return {
    read_file: tool({
      description:
        "Read a file from the codebase. Use a path relative to the root of the project root.",

      inputSchema: z.object({
        path: z.string().describe("The relative path to the file to read."),
      }),

      execute: async ({ path: p }) => executor.readFile(p),
    }),

    list_files: tool({
      description: "List files and directories under a path.",
      inputSchema: z.object({
        path: z.string(),
        recursive: z.boolean().optional().default(false),
      }),
      execute: async ({ path: p, recursive }) =>
        executor.listFiles(p, recursive),
    }),

    search_files: tool({
      description:
        'Find files matching a glob pattern (e.g. "*.ts", "**/*.md"). Optional content substring filter.',
      inputSchema: z.object({
        root: z.string().describe("Directory to search, relative to root"),
        pattern: z
          .string()
          .describe("Glob-like pattern using * and ** (forward slashes)"),
        content_contains: z.string().optional(),
      }),
      execute: async ({ root, pattern, content_contains }) =>
        executor.searchFiles(root, pattern, content_contains),
    }),

    analyze_codebase: tool({
      description:
        "Summarize structure: file counts, size, extensions. Read-only.",
      inputSchema: z.object({
        path: z.string().default("."),
      }),
      execute: async ({ path: p }) => executor.analyzeCodebase(p),
    }),

    list_skills: tool({
      description:
        "List absolute paths to SKILL.md files under configured skill directories (Cursor / Claude).",
      inputSchema: z.object({}),
      execute: async () => executor.listSkills(),
    }),

    read_skill: tool({
      description:
        "Read a SKILL.md file. Path must be absolute and under skill roots, or use list_skills.",
      inputSchema: z.object({
        path: z.string(),
      }),
      execute: async ({ path: p }) => executor.readSkill(p),
    }),
  };
}

function askMd(question: string, answer: string): string {
  return `# Ask Mode\n\n## Question\n\n${question.trim()}\n\n## Answer\n\n${answer.trim()}\n`;
}

export async function runAskMode() {
  console.log(chalk.bold(chalk.blueBright("Running in Ask Mode...")));

  const questions = await text({
    message: "What would you like to ask the agent?",
  });

  if (isCancel(questions) || !questions.trim()) return;

  const config = defaultAgentConfig();
  config.tools.allowFileCreation = true;
  config.tools.allowFileModification = false;
  config.tools.allowFolderCreation = false;
  config.tools.allowShellExecution = false;

  const tracker = new ActionTracker();
  const executor = new ToolExecutor(tracker, config);

  const tools = {
    ...createAskTools(executor),
    ...createWebTools(tracker),

  };

  const agent = new ToolLoopAgent({
    model: getAgentModel(),
    stopWhen: stepCountIs(20),
    tools,
  });

  const result = await agent.generate({
    prompt: questions.trim(),
  });

  const answer = result.text?.trim() || "(no answer)";
  console.log(chalk.bold(chalk.greenBright("Agent Answer:")));
  console.log(renderTerminalMarkdown(answer) + "\n");

  const wantsSave = await confirm({
    message: "Save this answer to a .md file in the current directory?",
    initialValue: false,
  });

  if (isCancel(wantsSave) || !wantsSave) return;

  const filename = await text({
    message: "What filename should we use?",
    initialValue: "ask.md",
    validate: (value) => {
      const s = (value ?? "").trim();
      if (!s) return "Filename cannot be empty, Required!!.";
      if (s.includes("..") || s.includes("/") || s.includes("\\"))
        return "No Paths";
      if (!s.toLowerCase().endsWith(".md")) return "Filename must end with .md";
    },
  });

  if (isCancel(filename) || !filename.trim()) return;

  executor.createFile(filename, askMd(questions, answer));

  const ok = await runApprovalFlow(tracker);
  if (!ok) return executor.clearStagging();

  executor.applyApprovedFromTracker();
  executor.clearStagging();
}
