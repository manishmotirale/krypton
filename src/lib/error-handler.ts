import chalk from "chalk";
import { logger } from "./logger";

export class KryptonError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = "KryptonError";
  }
}

export function handleError(error: unknown): void {
  if (error instanceof KryptonError) {
    logger.error(error.message, error.details);
    if (error.code) {
      console.error(chalk.gray(`Error code: ${error.code}`));
    }
  } else if (error instanceof Error) {
    logger.error(error.message, error);
  } else {
    logger.error("An unknown error occurred", error);
  }
}

export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  context?: string
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    if (context) {
      logger.error(`Error in ${context}:`);
    }
    handleError(error);
    return null;
  }
}
