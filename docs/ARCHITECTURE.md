# KRYPTON Architecture

## Overview

KRYPTON is built with a modular architecture that separates concerns into distinct layers:

```
┌─────────────────────────────────────────────────┐
│              Entry Point (CLI/Bot)              │
│                 src/index.ts                     │
└─────────────────────┬───────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│              Mode Selection Layer                │
│                  src/modes/                      │
│  ┌─────────┬──────────┬──────────┬───────────┐ │
│  │ Agent   │   Ask    │   Plan   │ Telegram  │ │
│  └─────────┴──────────┴──────────┴───────────┘ │
└─────────────────────┬───────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│              Core Services Layer                 │
│  ┌──────────────────┬──────────────────────┐   │
│  │  AI Provider     │   Tool Executor      │   │
│  │  (OpenRouter)    │   (File Ops, Shell)  │   │
│  └──────────────────┴──────────────────────┘   │
└─────────────────────┬───────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│            Infrastructure Layer                  │
│  ┌────────┬──────────┬──────────┬──────────┐   │
│  │ Logger │  Config  │  Utils   │  Errors  │   │
│  └────────┴──────────┴──────────┴──────────┘   │
└─────────────────────────────────────────────────┘
```

## Directory Structure

### `/src`
The main source directory containing all application code.

### `/src/core`
Core business logic and integrations:
- **`/core/ai`**: AI provider configuration and model management

### `/src/modes`
Operation modes - the main feature modules:
- **`/modes/agent`**: Full codebase modification mode
- **`/modes/ask`**: Read-only query mode
- **`/modes/plan`**: Planning and execution mode
- **`/modes/telegram`**: Telegram bot integration

### `/src/lib`
Shared utilities and helpers:
- **`logger.ts`**: Structured logging
- **`error-handler.ts`**: Error handling and recovery
- **`utils.ts`**: Common utility functions
- **`version.ts`**: Version information

### `/src/ui`
User interface components:
- **`wakeup.ts`**: Welcome screen and banner
- **`terminal-md.ts`**: Markdown rendering

### `/src/config`
Configuration management:
- **`env.ts`**: Environment variable validation

## Key Components

### 1. Tool Executor
**Location**: `src/modes/agent/tool-executor.ts`

Handles all file system and shell operations with safety checks:
- File read/write/delete
- Directory creation
- File search and analysis
- Shell command execution (queued for approval)

**Features**:
- Path safety (prevents escape attacks)
- Overlay system (staging changes before approval)
- Exclusion patterns (node_modules, .git, etc.)
- Skill integration (Cursor/Claude skills)

### 2. Action Tracker
**Location**: `src/modes/agent/action-tracker.ts`

Tracks all operations for approval workflow:
- Logs every action with timestamp
- Manages action status (pending, approved, rejected)
- Groups related changes for review

### 3. AI Agent
**Location**: `src/core/ai/ai.config.ts`

Configures and provides AI model access:
- OpenRouter integration
- Model selection from environment
- Tool integration via AI SDK

### 4. Orchestrators
Each mode has an orchestrator that coordinates:
- Tool setup
- Agent configuration
- User interaction
- Approval workflows

## Data Flow

### Agent Mode Flow

```
User Input
    │
    ▼
Parse Goal
    │
    ▼
Initialize Tools & Tracker
    │
    ▼
AI Agent Loop
    │   │
    │   ├─> Read Files (immediate)
    │   ├─> Analyze Code (immediate)
    │   ├─> Create File (staged)
    │   ├─> Modify File (staged)
    │   └─> Delete File (staged)
    │
    ▼
Show Results
    │
    ▼
Approval Flow
    │   │
    │   ├─> Show Summary
    │   ├─> Show Diffs
    │   ├─> Accept/Reject Each
    │   └─> Apply Approved
    │
    ▼
Execute Changes
```

### Telegram Mode Flow

```
Telegram Message
    │
    ▼
Auth Check (isOwner)
    │
    ▼
Command Router
    │   │
    │   ├─> /ask   ──> Ask Mode
    │   ├─> /agent ──> Agent Mode
    │   └─> /plan  ──> Plan Mode
    │
    ▼
Execute Command
    │
    ▼
Approval (Inline Keyboard)
    │   │
    │   ├─> Show Diff Button
    │   ├─> Accept All Button
    │   └─> Reject All Button
    │
    ▼
Send Results
```

## Design Patterns

### 1. Tool Pattern
All agent capabilities are exposed as tools with:
- Input schema (Zod validation)
- Execute function
- Description for AI

Example:
```typescript
tool({
  description: "Read a file from the codebase",
  inputSchema: z.object({
    path: z.string(),
  }),
  execute: async ({ path }) => executor.readFile(path),
})
```

### 2. Approval Pattern
Mutations are staged and require approval:
```typescript
1. Operation staged (overlay)
2. Tracked (ActionTracker)
3. Shown to user (diff view)
4. User approves/rejects
5. If approved, apply to disk
```

### 3. Session Pattern (Telegram)
State is maintained in-memory:
```typescript
const sessions = new Map<chatId, SessionData>();
```

This allows multi-step interactions without persistence.

### 4. Middleware Pattern
Functions can be wrapped for common behaviors:
```typescript
withErrorHandling(async () => {
  // risky operation
})
```

## Extension Points

### Adding a New Tool

1. Add tool definition in agent-tools.ts:
```typescript
new_tool: tool({
  description: "...",
  inputSchema: z.object({ ... }),
  execute: async (args) => { ... }
})
```

2. Add executor method in tool-executor.ts:
```typescript
executorMethod(arg: string): string {
  // implementation
  this.tracker.log({ ... });
  return result;
}
```

### Adding a New Mode

1. Create directory: `src/modes/my-mode/`
2. Create orchestrator: `orchestrator.ts`
3. Export run function: `export async function runMyMode()`
4. Register in `src/modes/cli.ts`

### Adding Telegram Commands

1. Add handler in `src/modes/telegram/handlers.ts`:
```typescript
bot.command('mycommand', async (ctx) => {
  // handle command
});
```

2. Update constants in `constants.ts` to include in welcome

## Security Considerations

### Path Safety
All file paths are validated:
- Must be within codebase root
- Cannot escape with ../
- Exclusion patterns enforced

### Telegram Auth
Only owner can use bot:
```typescript
if (!isOwner(ctx.chat.id)) return;
```

### Approval Required
All mutations require explicit approval:
- File creates/modifies/deletes
- Shell commands
- Folder creation

### Environment Variables
Sensitive keys in .env:
- Never committed to git
- Validated on startup
- .env.example provided

## Performance

### Lazy Loading
- Modules loaded on demand
- AI client created once

### Batch Operations
- Multiple file changes grouped
- Single approval for related changes

### Exclusion Patterns
- Skip node_modules, .git, etc.
- Prevent unnecessary scans

## Error Handling

### Layers
1. **Tool Level**: Validate inputs, catch exceptions
2. **Executor Level**: Log errors, return safe messages
3. **Orchestrator Level**: Handle failures gracefully
4. **Global Level**: Catch uncaught exceptions

### User Feedback
- Clear error messages
- Suggestions for fixes
- Never expose stack traces to user (only in debug)

## Testing Strategy

### Manual Testing
Current approach: test each mode manually

### Future: Automated Testing
- Unit tests for utilities
- Integration tests for tools
- E2E tests for modes

## Deployment

### Binary Distribution
```bash
bun build src/index.ts --compile --outfile krypton
```

### NPM Package
```bash
npm publish
```

### Docker (Future)
```dockerfile
FROM oven/bun
COPY . /app
WORKDIR /app
RUN bun install
CMD ["bun", "start"]
```

## Monitoring

### Logging
- All operations logged
- Action tracker keeps history
- Debug mode available (LOG_LEVEL=DEBUG)

### Metrics (Future)
- Operation counts
- Success/failure rates
- Performance timing

## Roadmap

### Phase 1 (Current)
- ✅ Core modes
- ✅ Telegram integration
- ✅ Approval workflow
- ✅ Web tools

### Phase 2
- [ ] Session persistence
- [ ] Undo/redo
- [ ] Better error recovery
- [ ] Performance metrics

### Phase 3
- [ ] Plugin system
- [ ] Multiple AI providers
- [ ] Web UI
- [ ] Collaborative features
