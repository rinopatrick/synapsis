import { describe, it, expect } from "vitest";
import { AIProvider } from "./provider";
import type { AIProviderConfig } from "../types";

const getBaseConfig = (): AIProviderConfig => ({
  type: "api",
  apiKey: "sk-test-key",
  provider: "openai",
  model: "gpt-4",
});

describe("AIProvider", () => {
  describe("isConfigured()", () => {
    it("returns true when API key is set", () => {
      const provider = new AIProvider(getBaseConfig());
      expect(provider.isConfigured()).toBe(true);
    });

    it("returns false when API key is missing for api type", () => {
      const provider = new AIProvider({ type: "api" });
      expect(provider.isConfigured()).toBe(false);
    });

    it("returns true for local type with endpoint", () => {
      const provider = new AIProvider({
        type: "local",
        localEndpoint: "http://localhost:11434",
      });
      expect(provider.isConfigured()).toBe(true);
    });

    it("returns true for oauth type with token", () => {
      const provider = new AIProvider({
        type: "oauth",
        oauthToken: "token-123",
      });
      expect(provider.isConfigured()).toBe(true);
    });
  });

  describe("getConfig()", () => {
    it("hides sensitive data", () => {
      const provider = new AIProvider(getBaseConfig());
      const config = provider.getConfig();
      expect(config).not.toHaveProperty("apiKey");
      expect(config).not.toHaveProperty("oauthToken");
      expect(config.type).toBe("api");
      expect(config.provider).toBe("openai");
      expect(config.model).toBe("gpt-4");
    });
  });

  describe("setType()", () => {
    it("changes provider type", () => {
      const provider = new AIProvider(getBaseConfig());
      provider.setType("local");
      expect(provider.getConfig().type).toBe("local");
    });
  });

  describe("setApiKey()", () => {
    it("sets type to api", () => {
      const provider = new AIProvider({ type: "local", localEndpoint: "http://localhost:11434" });
      provider.setApiKey("new-key");
      expect(provider.getConfig().type).toBe("api");
      expect(provider.isConfigured()).toBe(true);
    });
  });

  describe("setLocalEndpoint()", () => {
    it("sets type to local", () => {
      const provider = new AIProvider(getBaseConfig());
      provider.setLocalEndpoint("http://localhost:11434");
      expect(provider.getConfig().type).toBe("local");
      expect(provider.isConfigured()).toBe(true);
    });
  });

  describe("setOAuthToken()", () => {
    it("sets type to oauth with provider", () => {
      const provider = new AIProvider(getBaseConfig());
      provider.setOAuthToken("token-abc", "openai");
      expect(provider.getConfig().type).toBe("oauth");
      expect(provider.isConfigured()).toBe(true);
    });
  });

  describe("updateConfig()", () => {
    it("merges config fields", () => {
      const provider = new AIProvider(getBaseConfig());
      provider.updateConfig({ model: "gpt-3.5-turbo", provider: "anthropic" });
      const config = provider.getConfig();
      expect(config.model).toBe("gpt-3.5-turbo");
      expect(config.provider).toBe("anthropic");
      expect(config.type).toBe("api");
    });

    it("can change type via updateConfig", () => {
      const provider = new AIProvider(getBaseConfig());
      provider.updateConfig({ type: "local", localEndpoint: "http://localhost:11434" });
      expect(provider.getConfig().type).toBe("local");
      expect(provider.isConfigured()).toBe(true);
    });
  });

  describe("isConfigured() edge cases", () => {
    it("returns false for local type without endpoint", () => {
      const provider = new AIProvider({ type: "local" });
      expect(provider.isConfigured()).toBe(false);
    });

    it("returns false for oauth type without token", () => {
      const provider = new AIProvider({ type: "oauth" });
      expect(provider.isConfigured()).toBe(false);
    });

    it("returns false for empty api key", () => {
      const provider = new AIProvider({ type: "api", apiKey: "" });
      expect(provider.isConfigured()).toBe(false);
    });
  });

  describe("generateDecision()", () => {
    it("throws when not configured", async () => {
      const provider = new AIProvider({ type: "api" });
      await expect(provider.generateDecision("test context")).rejects.toThrow();
    });
  });

  describe("generateHint()", () => {
    it("throws when not configured", async () => {
      const provider = new AIProvider({ type: "api" });
      await expect(provider.generateHint("react", "beginner")).rejects.toThrow();
    });
  });

  describe("generateExplanation()", () => {
    it("throws when not configured", async () => {
      const provider = new AIProvider({ type: "api" });
      await expect(provider.generateExplanation("react", "component model")).rejects.toThrow();
    });
  });

  describe("reviewCode()", () => {
    it("throws when not configured", async () => {
      const provider = new AIProvider({ type: "api" });
      await expect(provider.reviewCode("const x = 1;", "typescript")).rejects.toThrow();
    });
  });

  describe("chat()", () => {
    it("throws for unknown provider type", async () => {
      const provider = new AIProvider({ type: "api", apiKey: "test" });
      provider.setType("unknown" as any);
      await expect(provider.chat([{ role: "user", content: "test" }])).rejects.toThrow();
    });

    it("throws for api type without key", async () => {
      const provider = new AIProvider({ type: "api" });
      await expect(provider.chat([{ role: "user", content: "test" }])).rejects.toThrow();
    });
  });

  describe("getConfig()", () => {
    it("never exposes apiKey", () => {
      const provider = new AIProvider(getBaseConfig());
      const config = provider.getConfig();
      expect(JSON.stringify(config)).not.toContain("sk-test-key");
    });

    it("never exposes oauthToken", () => {
      const provider = new AIProvider({ type: "oauth", oauthToken: "secret-token" });
      const config = provider.getConfig();
      expect(JSON.stringify(config)).not.toContain("secret-token");
    });
  });
});
