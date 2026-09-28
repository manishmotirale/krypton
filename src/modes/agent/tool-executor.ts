import fs from "node:fs";
import path from "node:path";
import { homedir } from "node:os";
import { spawnSync } from "node:child_process";

import type { AgentConfig, ActionLog } from "./types";
import { ActionTracker } from "./action-tracker";

const TEXT_EXT = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".json",
  ".md",
  ".mdx",
  ".html",
  ".yml",
  ".yaml",
  ".toml",
  ".txt",
]);

function isProbablyTextFile(filePath: string): boolean {
  const ext = path.extname(filePath).toLowerCase();

  return TEXT_EXT.has(ext) || ext === "";
}

export class ToolExecutor {
  private overlay = new Map<string, string>();
  private deleted = new Set<string>();

  private readonly norm = (rel: string) =>
    path.posix.normalize(rel.split(path.sep).join("/")).replace(/^\.\/+/, "");

  constructor(
    private readonly tracker: ActionTracker,
    private readonly config: AgentConfig,
  ) {}

  // 1. resolveSafe
  private resolveSafe(rel: string): string {
    const base = path.resolve(this.config.codebasePath);
    const target = path.resolve(base, rel);

    if (target !== base && !target.startsWith(base + path.sep)) {
      throw new Error(`Path escapes codebase: ${rel}`);
    }

    return target;
  }

  // 2. excluded
  private excluded(relPath: string): boolean {
    const rel = this.norm(relPath);

    const excluded = [
      ".git",
      ".git/",
      "node_modules",
      "node_modules/",
      ".next",
      ".next/",
      "dist",
      "dist/",
      "build",
      "build/",
    ];

    return excluded.some((item) => rel === item || rel.startsWith(item));
  }

  // 3. assertNotExcluded
  private assertNotExcluded(rel: string, op: string): void {
    if (this.excluded(rel)) {
      throw new Error(`${op}: path is excluded: ${rel}`);
    }
  }

  // 4. getEffectiveText
  private getEffectiveText(rel: string): string | undefined {
    const key = this.norm(rel);

    if (this.deleted.has(key)) {
      return undefined;
    }

    if (this.overlay.has(key)) {
      return this.overlay.get(key);
    }

    const abs = this.resolveSafe(key);

    if (!fs.existsSync(abs)) {
      return undefined;
    }

    if (!fs.statSync(abs).isFile()) {
      return undefined;
    }

    return fs.readFileSync(abs, "utf8");
  }

  // 5. readFile
  readFile(rel: string): string {
    this.assertNotExcluded(rel, "read_file");

    const key = this.norm(rel);
    const text = this.getEffectiveText(key);

    if (text === undefined) {
      throw new Error(`read_file: file not found: ${rel}`);
    }

    this.tracker.log({
      type: "code_analysis",
      path: key,
      details: {
        after: text,
        toolName: "read_file",
      },
      status: "executed",
    });

    return text;
  }

  // 6. createFile
  createFile(rel: string, content: string): string {
    this.assertNotExcluded(rel, "create_file");

    const key = this.norm(rel);
    const abs = this.resolveSafe(key);

    if (fs.existsSync(abs) || this.overlay.has(key)) {
      throw new Error(`create_file: file already exists: ${rel}`);
    }

    this.overlay.set(key, content);
    this.deleted.delete(key);

    this.tracker.log({
      type: "file_create",
      path: key,
      details: {
        after: content,
        toolName: "create_file",
      },
      status: "pending",
    });

    return `Created file: ${key}`;
  }

  // 7. modifyFile
  modifyFile(rel: string, content: string): string {
    this.assertNotExcluded(rel, "modify_file");

    const key = this.norm(rel);

    const before = this.getEffectiveText(key);

    if (before === undefined) {
      throw new Error(`modify_file: file not found: ${rel}`);
    }

    this.overlay.set(key, content);
    this.deleted.delete(key);

    this.tracker.log({
      type: "file_modify",
      path: key,
      details: {
        before,
        after: content,
        toolName: "modify_file",
      },
      status: "pending",
    });

    return `Modified file: ${key}`;
  }

  // 8. deleteFile
  deleteFile(rel: string): string {
    this.assertNotExcluded(rel, "delete_file");

    const key = this.norm(rel);

    if (this.getEffectiveText(key) === undefined) {
      const abs = this.resolveSafe(key);

      if (!fs.existsSync(abs)) {
        throw new Error(`delete_file: file not found: ${rel}`);
      }
    }

    this.deleted.add(key);
    this.overlay.delete(key);

    this.tracker.log({
      type: "file_delete",
      path: key,
      details: {
        toolName: "delete_file",
      },
      status: "pending",
    });

    return `Deleted file: ${key}`;
  }

  // 9. createFolder
  createFolder(rel: string): string {
    this.assertNotExcluded(rel, "create_folder");

    const key = this.norm(rel);
    const abs = this.resolveSafe(key);

    if (fs.existsSync(abs)) {
      throw new Error(`create_folder: already exists: ${rel}`);
    }

    this.tracker.log({
      type: "folder_create",
      path: key,
      details: {
        toolName: "create_folder",
      },
      status: "pending",
    });

    return `Created folder: ${key}`;
  }

  // 10. listFiles
  listFiles(rel: string, recursive: boolean): string {
    this.assertNotExcluded(rel, "list_files");

    const root = this.resolveSafe(rel);

    if (!fs.existsSync(root)) {
      throw new Error(`list_files: path not found: ${rel}`);
    }

    const results: string[] = [];

    const walk = (dir: string) => {
      for (const ent of fs.readdirSync(dir, {
        withFileTypes: true,
      })) {
        const full = path.join(dir, ent.name);

        const relative = path
          .relative(this.config.codebasePath, full)
          .split(path.sep)
          .join("/");

        if (this.excluded(relative)) {
          continue;
        }

        results.push(relative);

        if (recursive && ent.isDirectory()) {
          walk(full);
        }
      }
    };

    if (fs.statSync(root).isDirectory()) {
      walk(root);
    } else {
      const relative = path
        .relative(this.config.codebasePath, root)
        .split(path.sep)
        .join("/");

      results.push(relative);
    }

    const out = results.sort().join("\n");

    this.tracker.log({
      type: "code_analysis",
      path: this.norm(rel),
      details: {
        after: out || "(none)",
        toolName: "list_files",
      },
      status: "executed",
    });

    return out || "(none)";
  }

  // 11. searchFiles
  searchFiles(
    rootRel: string,
    globPattern: string,
    contentQuery?: string,
  ): string {
    this.assertNotExcluded(rootRel, "search_files");

    const rootAbs = this.resolveSafe(rootRel);

    if (!fs.existsSync(rootAbs)) {
      throw new Error(`search_files: root not found: ${rootRel}`);
    }

    const results: string[] = [];

    const regexFromGlob = (g: string): RegExp => {
      const escaped = g
        .replace(/[.+^${}()|[\]\\]/g, "\\$&")
        .replace(/\*/g, "§§")
        .replace(/\?\*/g, "[^/\\\\]*")
        .replace(/§§/g, ".*")
        .replace(/\?/g, ".");

      return new RegExp(`^${escaped}$`, "i");
    };

    const nameRe = regexFromGlob(globPattern.replace(/\\/g, "/"));

    const walk = (dir: string) => {
      for (const ent of fs.readdirSync(dir, {
        withFileTypes: true,
      })) {
        const full = path.join(dir, ent.name);

        const rel = path
          .relative(this.config.codebasePath, full)
          .split(path.sep)
          .join("/");

        if (this.excluded(rel)) {
          continue;
        }

        if (ent.isDirectory()) {
          walk(full);
        } else if (nameRe.test(rel) || nameRe.test(ent.name)) {
          if (contentQuery) {
            if (!isProbablyTextFile(full)) {
              continue;
            }

            const text = fs.readFileSync(full, "utf8");

            if (!text.includes(contentQuery)) {
              continue;
            }
          }

          results.push(rel);
        }
      }
    };

    if (fs.statSync(rootAbs).isDirectory()) {
      walk(rootAbs);
    } else {
      const rel = path
        .relative(this.config.codebasePath, rootAbs)
        .split(path.sep)
        .join("/");

      results.push(rel);
    }

    const out = [...new Set(results)].sort().join("\n");

    this.tracker.log({
      type: "code_analysis",
      path: this.norm(rootRel),
      details: {
        after: out || "(no matches)",
        toolName: "search_files",
      },
      status: "executed",
    });

    return out || "(no matches)";
  }

  // 12. analyzeCodebase
  analyzeCodebase(rootRel: string): string {
    const rootAbs = this.resolveSafe(rootRel);

    if (!fs.existsSync(rootAbs)) {
      throw new Error(`analyze_codebase: not found: ${rootRel}`);
    }

    let files = 0;
    let dirs = 0;

    const walk = (dir: string) => {
      for (const ent of fs.readdirSync(dir, {
        withFileTypes: true,
      })) {
        const full = path.join(dir, ent.name);

        const rel = path.relative(this.config.codebasePath, full);

        if (this.excluded(rel)) {
          continue;
        }

        if (ent.isDirectory()) {
          dirs++;
          walk(full);
        } else {
          files++;
        }
      }
    };

    if (fs.statSync(rootAbs).isDirectory()) {
      walk(rootAbs);
    } else {
      files = 1;
    }

    const summary = `Files: ${files} | Directories: ${dirs}`;

    this.tracker.log({
      type: "code_analysis",
      path: this.norm(rootRel),
      details: {
        after: summary,
        toolName: "analyze_codebase",
      },
      status: "executed",
    });

    return summary;
  }

  // 13. queueShell
  queueShell(command: string): string {
    if (!this.config.tools.allowShellExecution) {
      throw new Error("Shell execution disabled");
    }

    this.tracker.log({
      type: "tool_execute",
      path: "shell",
      details: {
        command,
        toolName: "execute_shell",
      },
      status: "pending",
    });

    return `Shell queued: ${command}`;
  }

  // 14. skillRoots
  skillRoots(): string[] {
    const extra =
      process.env.SKILLS_DIRS?.split(/[;]/)
        .map((s) => s.trim())
        .filter(Boolean) ?? [];

    return [
      ...extra,
      path.join(homedir(), ".cursor/skills-cursor"),
      path.join(homedir(), ".claude/skills"),
    ];
  }

  // 15. listSkills
  listSkills(): string {
    const lines: string[] = [];

    for (const root of this.skillRoots()) {
      if (!fs.existsSync(root)) {
        continue;
      }

      const walk = (dir: string) => {
        for (const ent of fs.readdirSync(dir, {
          withFileTypes: true,
        })) {
          const full = path.join(dir, ent.name);

          if (ent.isDirectory()) {
            walk(full);
          } else if (ent.name === "SKILL.md") {
            lines.push(full);
          }
        }
      };

      walk(root);
    }

    const out = lines.sort().join("\n");

    this.tracker.log({
      type: "code_analysis",
      path: "skills",
      details: {
        after: out || "(none)",
        toolName: "list_skills",
      },
      status: "executed",
    });

    return out || "(none)";
  }

  // 16. readSkill
  readSkill(skillPath: string): string {
    const abs = path.isAbsolute(skillPath)
      ? path.normalize(skillPath)
      : path.normalize(path.resolve(this.config.codebasePath, skillPath));

    const allowed = this.skillRoots().some((root) => {
      const r = path.resolve(root);

      return abs === r || abs.startsWith(r + path.sep);
    });

    if (!allowed) {
      throw new Error("read_skill: outside skill roots");
    }

    if (!fs.existsSync(abs)) {
      throw new Error(`read_skill: not found: ${skillPath}`);
    }

    const text = fs.readFileSync(abs, "utf8");

    this.tracker.log({
      type: "code_analysis",
      path: abs,
      details: {
        after: text,
        toolName: "read_skill",
      },
      status: "executed",
    });

    return text;
  }

  // 17. applyApprovedFromTracker
  applyApprovedFromTracker(): {
    errors: string[];
  } {
    const errors: string[] = [];

    const all = [...this.tracker.getActions()];

    // Create approved folders
    for (const a of all.filter(
      (x) => x.type === "folder_create" && x.status === "approved",
    )) {
      try {
        fs.mkdirSync(this.resolveSafe(a.path), { recursive: true });
      } catch (e) {
        errors.push(String(e));
      }
    }

    // Apply approved file operations
    const fileOps = all
      .filter(
        (a) =>
          (a.type === "file_create" ||
            a.type === "file_modify" ||
            a.type === "file_delete") &&
          a.status === "approved",
      )
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    const lastByPath = new Map<string, ActionLog>();

    for (const a of fileOps) {
      lastByPath.set(this.norm(a.path), a);
    }

    for (const [p, a] of lastByPath) {
      try {
        if (a.type === "file_delete") {
          fs.rmSync(this.resolveSafe(p), { force: true });
        } else {
          const target = this.resolveSafe(p);

          fs.mkdirSync(path.dirname(target), { recursive: true });

          fs.writeFileSync(target, a.details.after ?? "", "utf8");
        }
      } catch (e) {
        errors.push(String(e));
      }
    }

    // Execute approved shell commands
    for (const a of all.filter(
      (x) => x.type === "tool_execute" && x.status === "approved",
    )) {
      const cmd = a.details.command;

      if (!cmd) {
        continue;
      }

      const r = spawnSync(cmd, {
        shell: true,
        cwd: this.config.codebasePath,
        encoding: "utf8",
        maxBuffer: 16 * 1024 * 1024,
      });

      if (r.status !== null && r.status !== 0) {
        errors.push(`shell exit ${r.status}: ${cmd}`);
      }
    }

    return { errors };
  }

  clearStagging(): void {
    this.overlay.clear();
    this.deleted.clear();
  }
}
