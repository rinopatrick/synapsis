import { describe, it, expect } from "vitest";
import { AIProvider } from "./provider";
import type { AIProviderConfig } from "../types";

const baseConfig: AIProviderConfig = {
  type: "api",
  apiKey: "sk-test-key",
  provider: "openai",
  model: "gpt-4",
};

describe("AIProvider", () => {
  describe("isConfigured()", () => {
    it("returns true when API key is set", () => {
      const provider = new AIProvider(baseConfig);
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
      const provider = new AIProvider(baseConfig);
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
      const provider = new AIProvider(baseConfig);
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
});
