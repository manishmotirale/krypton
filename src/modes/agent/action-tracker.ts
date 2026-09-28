import type { ActionLog, ActionType, ActionStatus } from "./types";
import { isMutationType } from "./types";

export class ActionTracker {
  private actions: ActionLog[] = [];

  log(
    entry: Omit<ActionLog, "id" | "timestamp"> & {
      id?: string;
      timestamp?: Date;
    },
  ): ActionLog {
    const action: ActionLog = {
      id: entry.id ?? `action_${this.actions.length}`,
      timestamp: entry.timestamp ?? new Date(),
      type: entry.type,
      path: entry.path,
      details: { ...entry.details },
      status: entry.status,
      userApproved: entry.userApproved,
    };

    this.actions.push(action);

    return action;
  }

  getActions(): readonly ActionLog[] {
    return this.actions;
  }

  getPendingMutations(): ActionLog[] {
    return this.actions.filter(
      (act) => isMutationType(act.type) && act.status === "pending",
    );
  }

  updateStatus(id: string, status: ActionStatus, userApproved?: boolean): void {
    const act = this.actions.find((a) => a.id === id);

    if (!act) return;

    act.status = status;

    if (userApproved !== undefined) {
      act.userApproved = userApproved;
    }
  }
}
