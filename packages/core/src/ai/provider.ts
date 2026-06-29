import type {
  AIProviderConfig,
  AIProviderType,
  AIMessage,
  AIResponse,
  Decision,
} from "../types";

export class AIProvider {
  private config: AIProviderConfig;

  constructor(config: AIProviderConfig) {
    this.config = config;
  }

  /**
   * Send a chat message and get response
   */
  async chat(messages: AIMessage[]): Promise<string> {
    switch (this.config.type) {
      case "api":
        return this.chatWithAPI(messages);
      case "local":
        return this.chatWithLocal(messages);
      case "oauth":
        return this.chatWithOAuth(messages);
      default:
        throw new Error(`Unknown provider type: ${this.config.type}`);
    }
  }

  /**
   * Generate a structured decision
   */
  async generateDecision(context: string): Promise<Decision> {
    const prompt = `Based on this context: "${context}"
    
Generate a decision with the following JSON structure:
{
  "id": "unique-id",
  "topic": "topic-name",
  "category": "architecture|data|backend|frontend|quality",
  "question": "The question to ask",
  "hint": "A helpful hint",
  "options": [
    {
      "id": "option-id",
      "label": "Display Label",
      "description": "Short description",
      "value": "value"
    }
  ],
  "explanation": "Why this decision matters",
  "correctAnswer": "recommended-value",
  "difficulty": "easy|medium|hard"
}

Return ONLY the JSON, no other text.`;

    const response = await this.chat([
      { role: "system", content: "You are a helpful assistant that generates structured decisions." },
      { role: "user", content: prompt },
    ]);

    try {
      return JSON.parse(response);
    } catch {
      throw new Error("Failed to parse decision from AI response");
    }
  }

  /**
   * Generate a hint for a topic
   */
  async generateHint(
    topic: string,
    level: string,
    context?: string
  ): Promise<string> {
    const prompt = `Generate a helpful hint for someone learning about "${topic}".
Level: ${level}
${context ? `Context: ${context}` : ""}

The hint should:
- Be ${level === "beginner" ? "simple and encouraging" : level === "intermediate" ? "moderately detailed" : "concise and technical"}
- Guide thinking without giving the answer
- Be 1-2 sentences max`;

    const response = await this.chat([
      { role: "system", content: "You are a helpful learning assistant." },
      { role: "user", content: prompt },
    ]);

    return response;
  }

  /**
   * Generate explanation for a concept
   */
  async generateExplanation(
    topic: string,
    answer: string,
    context?: string
  ): Promise<string> {
    const prompt = `Explain why "${answer}" is a good choice for "${topic}".
${context ? `Context: ${context}` : ""}

The explanation should:
- Be clear and educational
- Mention trade-offs if relevant
- Be 2-3 sentences`;

    const response = await this.chat([
      { role: "system", content: "You are a helpful learning assistant." },
      { role: "user", content: prompt },
    ]);

    return response;
  }

  /**
   * Review code and provide feedback
   */
  async reviewCode(
    code: string,
    language: string,
    context?: string
  ): Promise<string> {
    const prompt = `Review this ${language} code and provide constructive feedback:
\`\`\`${language}
${code}
\`\`\`
${context ? `Context: ${context}` : ""}

Focus on:
- Code quality
- Potential issues
- Learning opportunities
- Suggestions for improvement`;

    const response = await this.chat([
      { role: "system", content: "You are a helpful code reviewer and learning assistant." },
      { role: "user", content: prompt },
    ]);

    return response;
  }

  /**
   * Chat with API provider (OpenAI/Anthropic/Google)
   */
  private async chatWithAPI(messages: AIMessage[]): Promise<string> {
    // This would use the actual API SDK
    // For now, return a placeholder
    const provider = this.config.provider || "openai";
    
    // In production, this would make actual API calls
    // Example with OpenAI:
    // const response = await openai.chat.completions.create({
    //   model: this.config.model || "gpt-4",
    //   messages: messages.map(m => ({ role: m.role, content: m.content })),
    // });
    // return response.choices[0].message.content;

    return `[${provider} API Response] This is a placeholder. In production, this would call the ${provider} API.`;
  }

  /**
   * Chat with local model (Ollama)
   */
  private async chatWithLocal(messages: AIMessage[]): Promise<string> {
    const endpoint = this.config.localEndpoint || "http://localhost:11434";
    
    try {
      const response = await fetch(`${endpoint}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: this.config.model || "llama2",
          messages: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.message.content;
    } catch (error) {
      console.error("Ollama chat error:", error);
      throw new Error("Failed to connect to local model. Is Ollama running?");
    }
  }

  /**
   * Chat with OAuth provider
   */
  private async chatWithOAuth(messages: AIMessage[]): Promise<string> {
    // OAuth would use the user's account (e.g., ChatGPT)
    // This requires OAuth flow implementation
    const provider = this.config.oauthProvider || "openai";
    
    // In production, this would use the OAuth token
    // Example:
    // const response = await fetch("https://api.openai.com/v1/chat/completions", {
    //   headers: { Authorization: `Bearer ${this.config.oauthToken}` },
    //   ...
    // });

    return `[${provider} OAuth Response] This is a placeholder. In production, this would use OAuth authentication.`;
  }

  /**
   * Update provider config
   */
  updateConfig(config: Partial<AIProviderConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current config (without sensitive data)
   */
  getConfig(): Omit<AIProviderConfig, "apiKey" | "oauthToken"> {
    const { apiKey, oauthToken, ...safeConfig } = this.config;
    return safeConfig;
  }

  /**
   * Check if provider is configured
   */
  isConfigured(): boolean {
    switch (this.config.type) {
      case "api":
        return !!this.config.apiKey;
      case "local":
        return !!this.config.localEndpoint;
      case "oauth":
        return !!this.config.oauthToken;
      default:
        return false;
    }
  }

  /**
   * Switch provider type
   */
  setType(type: AIProviderType): void {
    this.config.type = type;
  }

  /**
   * Set API key
   */
  setApiKey(apiKey: string): void {
    this.config.apiKey = apiKey;
    this.config.type = "api";
  }

  /**
   * Set local endpoint
   */
  setLocalEndpoint(endpoint: string): void {
    this.config.localEndpoint = endpoint;
    this.config.type = "local";
  }

  /**
   * Set OAuth token
   */
  setOAuthToken(token: string, provider: string): void {
    this.config.oauthToken = token;
    this.config.oauthProvider = provider;
    this.config.type = "oauth";
  }
}

// Re-export types
export type { AIProviderConfig, AIProviderType, AIMessage, AIResponse };
