import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText, streamText, type CoreMessage } from "ai";

export type AIProviderType = "openai" | "anthropic" | "ollama";

export interface AIConfig {
  provider: AIProviderType;
  apiKey?: string;
  model?: string;
  baseURL?: string;
}

/**
 * Create AI provider instance
 */
function createProvider(config: AIConfig) {
  switch (config.provider) {
    case "openai":
      return createOpenAI({
        apiKey: config.apiKey || process.env.OPENAI_API_KEY,
        baseURL: config.baseURL,
      });

    case "anthropic":
      return createAnthropic({
        apiKey: config.apiKey || process.env.ANTHROPIC_API_KEY,
        baseURL: config.baseURL,
      });

    case "ollama":
      // Ollama uses OpenAI-compatible API
      return createOpenAI({
        apiKey: "ollama", // Ollama doesn't need a real key
        baseURL: config.baseURL || "http://localhost:11434/v1",
      });

    default:
      throw new Error(`Unknown provider: ${config.provider}`);
  }
}

/**
 * Generate text with AI
 */
export async function generateAIText(
  config: AIConfig,
  messages: CoreMessage[],
  options?: {
    maxTokens?: number;
    temperature?: number;
    system?: string;
  }
) {
  const provider = createProvider(config);
  const model = provider(config.model || getDefaultModel(config.provider));

  return generateText({
    model: model as any,
    messages,
    maxTokens: options?.maxTokens || 1000,
    temperature: options?.temperature || 0.7,
    system: options?.system,
  });
}

/**
 * Stream text with AI
 */
export async function streamAIText(
  config: AIConfig,
  messages: CoreMessage[],
  options?: {
    maxTokens?: number;
    temperature?: number;
    system?: string;
  }
) {
  const provider = createProvider(config);
  const model = provider(config.model || getDefaultModel(config.provider));

  return streamText({
    model: model as any,
    messages,
    maxTokens: options?.maxTokens || 1000,
    temperature: options?.temperature || 0.7,
    system: options?.system,
  });
}

/**
 * Get default model for provider
 */
function getDefaultModel(provider: AIProviderType): string {
  switch (provider) {
    case "openai":
      return "gpt-4o-mini";
    case "anthropic":
      return "claude-3-haiku-20240307";
    case "ollama":
      return "llama2";
    default:
      return "gpt-4o-mini";
  }
}

/**
 * Check if provider is available
 */
export async function checkProviderAvailability(
  config: AIConfig
): Promise<boolean> {
  try {
    const provider = createProvider(config);
    const model = provider(config.model || getDefaultModel(config.provider));

    // Try a simple generation
    await generateText({
      model: model as any,
      messages: [{ role: "user", content: "Hello" }],
      maxTokens: 5,
    });

    return true;
  } catch (error) {
    console.error(`Provider ${config.provider} not available:`, error);
    return false;
  }
}

/**
 * Get available providers
 */
export async function getAvailableProviders(): Promise<AIProviderType[]> {
  const providers: AIProviderType[] = [];

  // Check OpenAI
  if (process.env.OPENAI_API_KEY) {
    providers.push("openai");
  }

  // Check Anthropic
  if (process.env.ANTHROPIC_API_KEY) {
    providers.push("anthropic");
  }

  // Check Ollama
  try {
    const response = await fetch("http://localhost:11434/api/tags");
    if (response.ok) {
      providers.push("ollama");
    }
  } catch {}

  return providers;
}
