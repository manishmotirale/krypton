<div align="center">

<img src="./krypton.png" alt="KRYPTON Logo" width="180"/>

# 🚀 KRYPTON

### *Think. Act. Automate.*

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-installation">Installation</a> •
  <a href="#-usage">Usage</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-distribution">Distribution</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge" alt="Version"/>
  <img src="https://img.shields.io/badge/Bun-1.4.2%2B-black?style=for-the-badge&logo=bun&logoColor=white" alt="Bun"/>
  <img src="https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/AI-Powered-purple?style=for-the-badge" alt="AI Powered"/>
  <img src="https://img.shields.io/badge/Telegram-Bot-blue?style=for-the-badge&logo=telegram" alt="Telegram"/>
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License"/>
</p>

</div>

---

## 🎯 What is KRYPTON?

**KRYPTON** is an AI-powered coding companion that helps you understand, modify, and interact with your codebase using natural language.

It provides multiple ways to work with a project:

- 🤖 **Agent Mode** — make controlled changes to your codebase
- 🔍 **Ask Mode** — inspect and understand your codebase without modifying it
- 📋 **Plan Mode** — turn complex goals into multi-step implementation plans
- 💬 **Telegram Bot Mode** — access KRYPTON remotely through Telegram
- 🌐 **Web Tools** — use web search, scraping, and research when configured

KRYPTON is designed around an **approval-first workflow**, so code changes can be reviewed before they are applied.

---

## ✨ Features

<table>
<tr>
<td width="50%" valign="top">

### 🤖 Agent Mode

Full codebase modification with review and approval.

- Create, modify, and delete files
- Create folders recursively
- Execute shell commands
- Search and analyze files
- Stage changes before applying
- Visual diff view
- Explicit approval workflow
- Review changes one by one
- Safe and reversible operations

</td>
<td width="50%" valign="top">

### 🔍 Ask Mode

Read-only interaction with your codebase.

- Analyze code structure
- Search files and content
- Search by glob pattern
- Read files and directories
- Answer questions about the project
- Generate documentation
- Save answers as Markdown
- No file modifications
- No shell execution

</td>
</tr>

<tr>
<td width="50%" valign="top">

### 📋 Plan Mode

Break complex development goals into executable steps.

- Generate implementation plans
- Research the codebase before execution
- Use web tools when configured
- Select specific steps to execute
- Complexity ratings
- Full agent capabilities per step
- Batch approval workflow

</td>
<td width="50%" valign="top">

### 💬 Telegram Bot Mode

Use KRYPTON remotely through Telegram.

- Access Ask, Agent, and Plan modes
- Inline keyboard controls
- Approval workflows
- Diff viewing
- Real-time responses
- Owner-only access
- Dedicated command handlers

</td>
</tr>
</table>

### 🌐 Web Tools

When Firecrawl is configured, KRYPTON can:

- 🔎 Search the web
- 🌐 Scrape web pages
- 📚 Gather research context for planning

### 🔒 Safety First

KRYPTON includes safeguards around codebase operations:

- **Approval Workflow** — changes are reviewed before application
- **Path Safety** — helps prevent directory traversal
- **Exclusion Patterns** — protects critical directories
- **Action Tracking** — records operations for review
- **Read-Only Ask Mode** — safe codebase exploration

---

## 🧰 Tech Stack

| Area | Technology |
|---|---|
| Runtime | [Bun](https://bun.sh/) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| AI / LLM Gateway | [OpenRouter](https://openrouter.ai/) |
| Web Tools | [Firecrawl](https://firecrawl.dev/) |
| Telegram | [Telegraf](https://telegraf.js.org/) |
| CLI Prompts | [Clack](https://github.com/natemoo-re/clack) |
| AI SDK | [Vercel AI SDK](https://sdk.vercel.ai/) |
| Validation | [Zod](https://zod.dev/) |
| Markdown | Marked / Marked Terminal |
| Terminal UI | Chalk |
| Diff Generation | `diff` |

---

# 🚀 Quick Start

The fastest way to start KRYPTON:

```bash
bun install
cp .env.example .env
bun wakeup
```

That's it. 🎉

### First Run

After launching KRYPTON:

```text
██╗  ██╗██████╗ ██╗   ██╗██████╗ ████████╗ ██████╗ ███╗   ██╗
██║ ██╔╝██╔══██╗╚██╗ ██╔╝██╔══██╗╚══██╔══╝██╔═══██╗████╗  ██║
█████╔╝ ██████╔╝ ╚████╔╝ ██████╔╝   ██║   ██║   ██║██╔██╗ ██║
██╔═██╗ ██╔══██╗  ╚██╔╝  ██╔═══╝    ██║   ██║   ██║██║╚██╗██║
██║  ██╗██║  ██║   ██║   ██║        ██║   ╚██████╔╝██║ ╚████║
╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝        ╚═╝    ╚═════╝ ╚═╝  ╚═══╝

? Which mode do you want to use?
❯ AI Mode (CLI)
  Telegram Mode (Bot)
  Exit
```

Use **↑ / ↓** to navigate and **Enter** to select.

---

# 📦 Installation

## Prerequisites

### Required

- [Bun](https://bun.sh/) **v1.4.2+**
- **Node.js v20+**
- An [OpenRouter API key](https://openrouter.ai/)

### Optional

- [Firecrawl API key](https://firecrawl.dev/) — enables web tools
- Telegram Bot Token — enables Telegram mode
- Telegram Owner ID — restricts bot access to the owner

---

## Step 1 — Clone the Repository

Replace `<repository-url>` with the actual GitHub repository URL.

```bash
git clone <repository-url>
cd krypton
```

## Step 2 — Install Dependencies

```bash
bun install
```

## Step 3 — Configure Environment Variables

Create your local environment file:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Required
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_DEFAULT_MODEL=openrouter/auto

# Optional - Web tools
FIRECRAWL_API_KEY=your_firecrawl_api_key

# Optional - Telegram bot
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_OWNER_ID=your_telegram_user_id
TELEGRAM_LINK=t.me/your_bot_username

# Optional - Custom skills directories
# SKILLS_DIRS=/path/to/skills/dir1;/path/to/skills/dir2
```

> **Security:** Never commit your real `.env` file or API keys to Git.

## Step 4 — Start KRYPTON

```bash
bun wakeup
```

---

# 🎮 Usage

## Start Commands

| Command | Description |
|---|---|
| `bun wakeup` | ⭐ Recommended way to start KRYPTON |
| `bun start` | Traditional start command |
| `bun run dev` | Development mode with auto-reload |
| `bun run src/index.ts wakeup` | Run the wakeup flow directly |
| `wakeup-krypton` | Global command after installation |

---

## Global Installation on Windows

To use `wakeup-krypton` from any directory:

```powershell
.\install-global.ps1
```

Then restart your terminal and run:

```bash
wakeup-krypton
```

The installer creates a global script under `~\.krypton\` and adds it to `PATH`.

---

# 🧠 Modes

## 🤖 Agent Mode

**Purpose:** Modify your codebase with AI assistance.

### Capabilities

- Create files and folders
- Modify existing files
- Delete files
- Execute shell commands
- Search and analyze the codebase
- Read files and directories

### Approval Workflow

```text
User describes a task
        ↓
KRYPTON analyzes the codebase
        ↓
Changes are generated
        ↓
Diff is shown
        ↓
User reviews the changes
        ↓
User approves
        ↓
Changes are applied
```

### Example

```text
? What would you like to do?
> Add error handling to all API calls

[AI analyzes the project]

[Shows diff for approval]

? Apply Staged Changes?
❯ Approve and apply all changes
  Review one by one
  Cancel
```

---

## 🔍 Ask Mode

**Purpose:** Understand and query your codebase without making changes.

### Capabilities

- Read files
- List directories recursively
- Search files by glob pattern
- Search content
- Analyze code structure
- Use Cursor / Claude skills
- Use web tools when Firecrawl is configured
- Save answers to Markdown

### Example

```text
? What would you like to ask the agent?
> Where is authentication handled in this codebase?
```

Ask Mode does **not** modify files and does **not** execute shell commands.

---

## 📋 Plan Mode

**Purpose:** Plan and execute complex multi-step development work.

### Workflow

```text
1. User provides a goal
        ↓
2. KRYPTON researches the codebase
        ↓
3. KRYPTON generates a step-by-step plan
        ↓
4. User selects which steps to execute
        ↓
5. KRYPTON executes selected steps
        ↓
6. User reviews and approves the changes
```

### Example

```text
? What is the goal of this plan?
> Add TypeScript linting with ESLint and auto-fix on save
```

---

## 💬 Telegram Bot Mode

KRYPTON can expose its AI capabilities through Telegram.

### Setup

1. Create a bot with [@BotFather](https://t.me/BotFather)
2. Get your Telegram user ID from [@userinfobot](https://t.me/userinfobot)
3. Add the required values to `.env`
4. Start KRYPTON
5. Select **Telegram Mode (Bot)**

### Commands

| Command | Purpose |
|---|---|
| `/start` | Welcome message |
| `/ask <question>` | Ask about the codebase |
| `/agent <task>` | Execute an AI-assisted task |
| `/plan <goal>` | Generate an implementation plan |

---

# 💡 Examples

## Example 1 — Ask About the Codebase

```bash
bun wakeup
```

Select:

```text
AI Mode (CLI) → Ask Mode
```

Then ask:

```text
What TypeScript files use React?
```

---

## Example 2 — Create a File with Agent Mode

```bash
bun wakeup
```

Select:

```text
AI Mode (CLI) → Agent Mode
```

Then:

```text
Create a React component for a login form with email and password fields
```

KRYPTON generates the change, shows the diff, and waits for approval.

---

## Example 3 — Plan a Multi-Step Feature

```bash
bun wakeup
```

Select:

```text
AI Mode (CLI) → Plan Mode
```

Then:

```text
Implement a user authentication system
```

KRYPTON generates a plan, lets you choose steps, and executes the selected work.

---

## Example 4 — Use Telegram

```text
/ask What TypeScript files use React?
/agent Add error handling to all API calls
/plan Implement user authentication
```

---

# 🔐 Environment Variables

| Variable | Required | Purpose |
|---|:---:|---|
| `OPENROUTER_API_KEY` | ✅ | OpenRouter API key |
| `OPENROUTER_DEFAULT_MODEL` | ✅ | Default model, e.g. `openrouter/auto` |
| `FIRECRAWL_API_KEY` | ⚠️ | Web search and scraping |
| `TELEGRAM_BOT_TOKEN` | ⚠️ | Telegram bot access |
| `TELEGRAM_OWNER_ID` | ⚠️ | Restrict Telegram access to the owner |
| `TELEGRAM_LINK` | ⚠️ | Bot username / link |
| `SKILLS_DIRS` | ⚠️ | Custom skills directories |

### Environment Setup

```bash
cp .env.example .env
```

Then add your required values.

> API keys belong in `.env`, not in source code or Git history.

---

# 🛠️ Configuration

## Agent Configuration

The default agent configuration is defined in:

```text
src/modes/agent/types.ts
```

The project configuration includes:

```typescript
export const defaultAgentConfig = (): AgentConfig => ({
  codebasePath: process.cwd(),
  maxFileSizeToRead: 1024 * 1024,

  excludePatterns: [
    "node_modules",
    ".git",
    "dist",
    "build",
    ".next",
    "coverage",
    "*.log",
    ".env*",
  ],

  tools: {
    allowShellExecution: true,
    allowFileModification: true,
    allowFileCreation: true,
    allowFolderCreation: true,
  },
});
```

## Custom Skills

KRYPTON supports Cursor and Claude skills.

### Default Locations

```text
~/.cursor/skills-cursor/
~/.claude/skills/
```

### Custom Locations

Set:

```env
SKILLS_DIRS=/path/to/custom/skills;/another/path
```

Skills are Markdown files named `SKILL.md` that provide additional context to the AI.

---

# 📁 Project Structure

```text
krypton/
│
├── 📄 Configuration Files
│   ├── .env                  # Local environment variables
│   ├── .env.example          # Environment template
│   ├── .gitignore            # Git ignore patterns
│   ├── package.json          # Dependencies and scripts
│   ├── tsconfig.json         # TypeScript configuration
│   └── bun.lock              # Bun lock file
│
├── 📚 Documentation
│   ├── README.md             # Main documentation
│   ├── QUICKSTART.md         # 30-second quick start
│   ├── INSTALL.md            # Detailed installation
│   ├── HOW_TO_RUN.md         # Usage guide
│   ├── CHANGELOG.md          # Version history
│   ├── CONTRIBUTING.md       # Contribution guide
│   ├── LICENSE               # MIT License
│   └── docs/
│       ├── ARCHITECTURE.md   # System design
│       └── QUICK_START.md    # Quick reference
│
├── 🛠️ Scripts
│   ├── install-global.ps1    # Global installation
│   └── test-wakeup.ps1       # Installation test
│
├── 🎨 Assets
│   └── krypton.png           # Logo
│
└── 💻 Source Code (src/)
    │
    ├── 📌 Entry Point
    │   └── index.ts          # Main entry point
    │
    ├── 🧠 Core
    │   └── ai/
    │       ├── index.ts       # AI exports
    │       └── ai.config.ts   # OpenRouter setup
    │
    ├── 📚 Libraries
    │   ├── logger.ts          # Logging system
    │   ├── error-handler.ts   # Error handling
    │   └── utils.ts            # Utility functions
    │
    ├── 🎯 Modes
    │   ├── cli.ts             # CLI orchestrator
    │   │
    │   ├── agent/
    │   │   ├── orchestrator.ts
    │   │   ├── agent-tools.ts
    │   │   ├── tool-executor.ts
    │   │   ├── action-tracker.ts
    │   │   ├── approval.ts
    │   │   ├── diff-view.ts
    │   │   └── types.ts
    │   │
    │   ├── ask/
    │   │   └── orchestrator.ts
    │   │
    │   ├── plan/
    │   │   ├── orchestrator.ts
    │   │   ├── planner.ts
    │   │   ├── selection.ts
    │   │   ├── types.ts
    │   │   └── web-tools.ts
    │   │
    │   └── telegram/
    │       ├── index.ts
    │       ├── handlers.ts
    │       ├── auth.ts
    │       ├── constants.ts
    │       ├── text.ts
    │       ├── agent-run.ts
    │       ├── approval-session.ts
    │       └── plan-session.ts
    │
    └── 🎨 UI
        ├── wakeup.ts          # Welcome screen and banner
        └── terminal-md.ts     # Markdown rendering
```

---

# 🔧 Available Commands

## Development

```bash
# Start KRYPTON
bun wakeup
bun start

# Development
bun run dev

# TypeScript checking
bun run lint

# Build
bun run build

# Build standalone executable
bun run build:exe

# Show help and version
bun wakeup --help
bun wakeup --version

# Cleanup
bun run clean
```

## Windows Scripts

```powershell
# Test installation
.\test-wakeup.ps1

# Install globally
.\install-global.ps1

# Build executable
.\scripts\build-exe.ps1

# Create installer package
.\scripts\create-installer.ps1
```

## Telegram

```text
/start
/ask <question>
/agent <task>
/plan <goal>
```

---

# 🧪 Testing

## Quick Test

Run:

```powershell
.\test-wakeup.ps1
```

The supplied test flow checks:

- `--version`
- `--help`
- Environment file existence
- TypeScript compilation

## Manual Testing

### Ask Mode

```text
AI Mode → Ask Mode

Question:
What files are in this project?
```

### Agent Mode

```text
AI Mode → Agent Mode

Task:
Create a test.txt file with "Hello World"
```

### Plan Mode

```text
AI Mode → Plan Mode

Goal:
Add a new utility function for date formatting
```

### Telegram Mode

Use the configured Telegram bot and test `/ask`, `/agent`, and `/plan`.

---

# 🐛 Troubleshooting

| Issue | Solution |
|---|---|
| `bun: command not found` | Install Bun from [bun.sh](https://bun.sh/) |
| `.env file not found` | Run `cp .env.example .env` |
| `OPENROUTER_API_KEY is required` | Add your OpenRouter key to `.env` |
| `Cannot find module` | Run `bun install` |
| `wakeup-krypton: command not found` | Restart the terminal and verify `PATH` |
| Telegram bot not responding | Check `TELEGRAM_BOT_TOKEN` and `TELEGRAM_OWNER_ID` |
| `Path escapes codebase` | Avoid paths such as `../` that escape the project root |
| Command hangs | Press `Ctrl+C` and try again |
| Double-clicking the EXE closes | Run through `Start-KRYPTON.bat` or a terminal |

---

# 🏗️ Architecture

KRYPTON is organized around a clear separation between the CLI, AI core, modes, tools, and terminal UI.

```text
                    ┌───────────────────┐
                    │      KRYPTON      │
                    │    CLI / Wakeup   │
                    └─────────┬─────────┘
                              │
                    ┌─────────▼─────────┐
                    │   Mode Selection  │
                    └──────┬──────┬─────┘
                           │      │
              ┌────────────┘      └──────────────┐
              ▼                                   ▼
       ┌─────────────┐                     ┌──────────────┐
       │  AI Mode    │                     │ Telegram Bot │
       └──────┬──────┘                     └──────┬───────┘
              │                                   │
       ┌──────┼──────────────┐                    │
       ▼      ▼              ▼                    │
    Agent    Ask           Plan ◄─────────────────┘
       │      │              │
       └──────┴──────┬───────┘
                     ▼
             ┌───────────────┐
             │ AI / OpenRouter│
             └───────┬───────┘
                     │
           ┌─────────┴──────────┐
           ▼                    ▼
      Codebase Tools         Web Tools
           │                    │
           ▼                    ▼
      Files / Shell        Firecrawl
```

---

# 📦 Distribution

KRYPTON can be packaged as a standalone Windows executable.

## Build the EXE

```powershell
.\scripts\build-exe.ps1
```

## Create the Installer Package

```powershell
.\scripts\create-installer.ps1
```

This creates:

```text
dist/krypton-installer-v1.0.0.zip
```

### Package Contents

```text
krypton-installer-v1.0.0.zip
├── krypton.exe
├── .env.example
├── SETUP.md
├── README.txt
├── Start-KRYPTON.bat
└── krypton.png
```

### Important

The executable does **not** include your `.env` file.

Users need:

1. Their own `.env`
2. Their own OpenRouter API key
3. An internet connection for API calls
4. Firecrawl credentials if web tools are used
5. Telegram credentials if Telegram mode is used

### Distribution Options

| Method | Setup | Updates | Notes |
|---|---|---|---|
| ZIP Download | Medium | Manual | Simple and direct |
| Web Installer | Easy | Manual | Useful for public distribution |
| GitHub Releases | Medium | Manual | Version tracking and release history |
| Electron Wrapper | Complex | Auto-update possible | Additional development work |
| Code Signing | Medium | Manual | Optional; helps with Windows trust warnings |

---

# 🔒 Security

### Never

- Commit `.env` to Git
- Include real API keys in the executable
- Share your personal `.env`
- Hard-code private credentials into source files

### Do

- Ship `.env.example`
- Let each user provide their own credentials
- Keep secrets local
- Review Agent Mode changes before applying them

---

# 📈 Project Stats

According to the project documentation:

| Metric | Value |
|---|---|
| Version | `1.0.0` |
| Lines of Code | ~3,500+ |
| Files | 40+ |
| Modes | 3 + Bot |

---

# 🗺️ Roadmap

## Phase 1 — Core ✅

- [x] Agent Mode
- [x] Ask Mode
- [x] Plan Mode
- [x] Telegram Bot
- [x] Web Tools
- [x] Approval Workflow

## Phase 2 — Enhancement 🚧

- [ ] Session persistence
- [ ] Undo/redo functionality
- [ ] Git integration
- [ ] Custom tool plugins
- [ ] Configuration UI
- [ ] Performance metrics

## Phase 3 — Advanced 📅

- [ ] Web UI dashboard
- [ ] Multiple AI providers
- [ ] Collaborative features
- [ ] Cloud deployment
- [ ] Marketplace for tools
- [ ] Line-level file editing

---

# 🤝 Contributing

Contributions are welcome.

## Development Setup

```bash
git clone https://github.com/your-username/krypton.git
cd krypton

bun install
cp .env.example .env

bun run dev
```

## Guidelines

- Use TypeScript for new code
- Follow existing project conventions
- Use meaningful names
- Keep functions focused
- Add comments for complex logic
- Update documentation when needed

### Naming Conventions

| Type | Convention | Example |
|---|---|---|
| Files | kebab-case | `agent-tools.ts` |
| Functions | camelCase | `createAgentTools()` |
| Classes | PascalCase | `ActionTracker` |
| Constants | UPPER_SNAKE_CASE | `MAX_FILE_SIZE` |

## Pull Request Flow

1. Fork the repository
2. Create a feature branch
3. Make focused changes
4. Test locally
5. Update documentation where appropriate
6. Commit with a descriptive message
7. Open a Pull Request

Example commit messages:

```text
feat: add web search tool
fix: resolve file path escaping issue
docs: update README with new examples
```

---

# 📝 Changelog

## [1.0.0]

### Added

- Agent Mode
- Ask Mode
- Plan Mode
- Telegram Bot
- Web Tools
- Action Tracking
- Diff View
- Approval-based file operations
- Cursor / Claude skills support
- File and folder operations
- Shell command execution
- Glob and content search
- Codebase statistics
- Environment validation
- Configurable agent behavior
- Exclusion patterns
- Custom skills directories
- Interactive CLI prompts
- Terminal Markdown rendering
- Telegram inline keyboard controls
- Structured logging
- Error handling

### Fixed

- `enssureMarked` → `ensureMarked`
- `constats.ts` → `constants.ts`
- `Operattions` → `Operations`
- `/plan` command logic issue

### Documentation

- Main project documentation
- Installation instructions
- Usage guides
- Contributing guidelines
- Environment example
- MIT license documentation

---

# 📚 Documentation Map

| Document | Purpose |
|---|---|
| `README.md` | Main project documentation |
| `QUICKSTART.md` | Fast setup |
| `INSTALL.md` | Detailed installation |
| `HOW_TO_RUN.md` | Running and usage guide |
| `docs/ARCHITECTURE.md` | System design |
| `docs/QUICK_START.md` | Quick reference |
| `CHANGELOG.md` | Version history |
| `CONTRIBUTING.md` | Contribution guidelines |
| `DISTRIBUTION.md` | Executable distribution |
| `LICENSE` | MIT License |

---

# 📜 License

KRYPTON is licensed under the **MIT License**.

```text
MIT License

Copyright (c) 2024 KRYPTON

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files...
```

See [`LICENSE`](./LICENSE) for the complete license text.

---

# 🙏 Acknowledgments

KRYPTON is built with:

- [Bun](https://bun.sh/)
- [OpenRouter](https://openrouter.ai/)
- [Firecrawl](https://firecrawl.dev/)
- [Telegraf](https://telegraf.js.org/)
- [Clack](https://github.com/natemoo-re/clack)
- [Vercel AI SDK](https://sdk.vercel.ai/)
- [TypeScript](https://www.typescriptlang.org/)
- [Zod](https://zod.dev/)

Special thanks to the open-source projects used for terminal rendering, Markdown processing, colors, and diff generation.

---

<div align="center">

## 🎉 Ready to Start?

```bash
bun wakeup
```

### **Think. Act. Automate. 🚀**

Made with ❤️ by the KRYPTON team

⭐ Star the repository if you find it helpful.

</div>
