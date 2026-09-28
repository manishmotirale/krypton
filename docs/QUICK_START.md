# Quick Start Guide

Get up and running with KRYPTON in 5 minutes.

## Prerequisites

- [Bun](https://bun.sh) installed
- OpenRouter API key

## Installation

```bash
# Clone the repo
git clone <repository-url>
cd krypton

# Install dependencies
bun install

# Setup environment
cp .env.example .env
```

## Configuration

Edit `.env`:

```env
OPENROUTER_API_KEY=sk-or-v1-your-key-here
OPENROUTER_DEFAULT_MODEL=openrouter/auto
```

Get your API key from [OpenRouter](https://openrouter.ai/).

## First Run

```bash
bun start
```

You'll see the KRYPTON banner and mode selection.

## Try Agent Mode

1. Select **"AI Mode (CLI)"**
2. Select **"Agent Mode"**
3. Type a task:
   ```
   Create a README.md file with project information
   ```
4. Watch the AI work
5. Review changes in the approval screen
6. Accept or reject

## Try Ask Mode

1. Select **"AI Mode (CLI)"**
2. Select **"Ask Mode"**
3. Ask a question:
   ```
   What files are in this project?
   ```
4. Get an answer immediately

## Try Plan Mode

1. Select **"AI Mode (CLI)"**
2. Select **"Plan Mode"**
3. Enter a goal:
   ```
   Add TypeScript configuration
   ```
4. Review the generated plan
5. Select steps to execute
6. Confirm and execute

## Try Telegram Bot (Optional)

1. Get bot token from [@BotFather](https://t.me/BotFather)
2. Get your user ID from [@userinfobot](https://t.me/userinfobot)
3. Add to `.env`:
   ```env
   TELEGRAM_BOT_TOKEN=your-token
   TELEGRAM_OWNER_ID=your-id
   ```
4. Run: `bun start`
5. Select **"Telegram Mode (Bot)"**
6. Message your bot on Telegram

## Common Commands

### CLI
```bash
bun start          # Start interactive mode
bun run dev        # Start with auto-reload
bun run lint       # Check TypeScript
bun run build      # Build for production
```

### Telegram Bot
```
/ask <question>    # Ask about codebase
/agent <task>      # Execute a task
/plan <goal>       # Generate a plan
```

## Examples

### Example 1: Create a Component

**Agent Mode:**
```
Create a React component for a button with props for text and onClick
```

### Example 2: Analyze Code

**Ask Mode:**
```
Show me all TypeScript files that import from React
```

### Example 3: Refactor

**Agent Mode:**
```
Refactor all console.log statements to use a logger utility
```

### Example 4: Documentation

**Agent Mode:**
```
Add JSDoc comments to all exported functions
```

## Tips

- Start with Ask Mode to understand your codebase
- Use Plan Mode for complex multi-step changes
- Always review diffs before approving
- Use descriptive task descriptions for better results

## Troubleshooting

### "OPENROUTER_API_KEY is required"
→ Add your API key to `.env`

### "File not found"
→ Check file paths are relative to project root

### "Path escapes codebase"
→ Don't use `../` in paths

### Bot not responding
→ Check TOKEN and OWNER_ID in `.env`

## Next Steps

- Read the [Architecture Guide](./ARCHITECTURE.md)
- Check out [Examples](./EXAMPLES.md)
- Read [Contributing](../CONTRIBUTING.md)

## Help

- Issues: [GitHub Issues](https://github.com/your-repo/issues)
- Docs: [Full Documentation](https://github.com/your-repo/wiki)
