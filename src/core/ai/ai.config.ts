import { createOpenRouter } from "@openrouter/ai-sdk-provider";

export function getAgentModel() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const modelId = process.env.OPENROUTER_DEFAULT_MODEL;

  if (!apiKey || !modelId) {
    throw new Error(
      "Missing required environment variables: OPENROUTER_API_KEY and OPENROUTER_DEFAULT_MODEL must be set in .env file"
    );
  }

  const provider = createOpenRouter({ apiKey });
  return provider(modelId);
}
