import { describe, it, expect } from "vitest";
import { DecisionRegistry } from "./registry";

describe("DecisionRegistry", () => {
  describe("lockDecision()", () => {
    it("sets locked and userChoice", () => {
      const registry = new DecisionRegistry();
      registry.analyzePrompt("I need a frontend framework");
      registry.lockDecision("framework", "react");

      const decision = registry.getDecision("framework");
      expect(decision).toBeDefined();
      expect(decision!.locked).toBe(true);
      expect(decision!.userChoice).toBe("react");
    });

    it("does nothing for unknown decision id", () => {
      const registry = new DecisionRegistry();
      registry.lockDecision("nonexistent", "value");
      // Should not throw
    });
  });

  describe("getPendingDecisions()", () => {
    it("returns empty when all are locked", () => {
      const registry = new DecisionRegistry();
      registry.analyzePrompt("I need a frontend framework");
      registry.lockDecision("framework", "react");

      expect(registry.getPendingDecisions()).toHaveLength(0);
    });
  });

  describe("analyzePrompt()", () => {
    it("extracts multiple decisions from text", () => {
      const registry = new DecisionRegistry();
      const decisions = registry.analyzePrompt(
        "I need a frontend framework, a database, and an api backend"
      );
      expect(decisions.length).toBeGreaterThanOrEqual(3);
      const topics = decisions.map((d) => d.id);
      expect(topics).toContain("framework");
      expect(topics).toContain("database");
      expect(topics).toContain("api");
    });

    it("detects styling decisions from css keyword", () => {
      const registry = new DecisionRegistry();
      const decisions = registry.analyzePrompt("I need css styling for my app");
      const topics = decisions.map((d) => d.id);
      expect(topics).toContain("styling");
    });

    it("returns empty for unrecognized prompt", () => {
      const registry = new DecisionRegistry();
      const decisions = registry.analyzePrompt("Hello world");
      expect(decisions).toHaveLength(0);
    });

    it("detects framework from ui keyword", () => {
      const registry = new DecisionRegistry();
      const decisions = registry.analyzePrompt("I need a ui library");
      expect(decisions.some((d) => d.id === "framework")).toBe(true);
    });

    it("detects framework from web keyword", () => {
      const registry = new DecisionRegistry();
      const decisions = registry.analyzePrompt("Building a web application");
      expect(decisions.some((d) => d.id === "framework")).toBe(true);
    });

    it("detects database from storage keyword", () => {
      const registry = new DecisionRegistry();
      const decisions = registry.analyzePrompt("I need storage for user data");
      expect(decisions.some((d) => d.id === "database")).toBe(true);
    });

    it("detects api from server keyword", () => {
      const registry = new DecisionRegistry();
      const decisions = registry.analyzePrompt("Building a server backend");
      expect(decisions.some((d) => d.id === "api")).toBe(true);
    });

    it("detects styling from design keyword", () => {
      const registry = new DecisionRegistry();
      const decisions = registry.analyzePrompt("I need a design system");
      expect(decisions.some((d) => d.id === "styling")).toBe(true);
    });

    it("is case-insensitive", () => {
      const registry = new DecisionRegistry();
      const decisions = registry.analyzePrompt("FRONTEND FRAMEWORK");
      expect(decisions.some((d) => d.id === "framework")).toBe(true);
    });
  });

  describe("getDecision()", () => {
    it("returns undefined for unknown id", () => {
      const registry = new DecisionRegistry();
      expect(registry.getDecision("nonexistent")).toBeUndefined();
    });

    it("returns decision after analyzePrompt", () => {
      const registry = new DecisionRegistry();
      registry.analyzePrompt("I need a frontend framework");
      const decision = registry.getDecision("framework");
      expect(decision).toBeDefined();
      expect(decision!.locked).toBe(false);
    });
  });

  describe("getAllDecisions()", () => {
    it("returns all locked and unlocked decisions", () => {
      const registry = new DecisionRegistry();
      registry.analyzePrompt("I need a frontend framework and database");
      registry.lockDecision("framework", "react");
      const all = registry.getAllDecisions();
      expect(all).toHaveLength(2);
      expect(all.some((d) => d.locked)).toBe(true);
      expect(all.some((d) => !d.locked)).toBe(true);
    });
  });

  describe("allRequiredLocked()", () => {
    it("returns false when decisions are pending", () => {
      const registry = new DecisionRegistry();
      registry.analyzePrompt("I need a frontend framework and database");
      expect(registry.allRequiredLocked()).toBe(false);
    });

    it("returns true when all decisions are locked", () => {
      const registry = new DecisionRegistry();
      registry.analyzePrompt("I need a frontend framework");
      registry.lockDecision("framework", "react");
      expect(registry.allRequiredLocked()).toBe(true);
    });

    it("returns true with no decisions", () => {
      const registry = new DecisionRegistry();
      expect(registry.allRequiredLocked()).toBe(true);
    });
  });

  describe("clear()", () => {
    it("removes all decisions", () => {
      const registry = new DecisionRegistry();
      registry.analyzePrompt("I need a frontend framework and database");
      expect(registry.getAllDecisions()).toHaveLength(2);
      registry.clear();
      expect(registry.getAllDecisions()).toHaveLength(0);
      expect(registry.getPendingDecisions()).toHaveLength(0);
    });
  });

  describe("decision options", () => {
    it("framework decision has expected options", () => {
      const registry = new DecisionRegistry();
      registry.analyzePrompt("I need a frontend framework");
      const decision = registry.getDecision("framework");
      expect(decision!.options.length).toBeGreaterThanOrEqual(3);
      const values = decision!.options.map((o) => o.value);
      expect(values).toContain("react");
      expect(values).toContain("vue");
      expect(values).toContain("svelte");
    });

    it("database decision has expected options", () => {
      const registry = new DecisionRegistry();
      registry.analyzePrompt("I need a database");
      const decision = registry.getDecision("database");
      expect(decision!.options.length).toBeGreaterThanOrEqual(3);
      const values = decision!.options.map((o) => o.value);
      expect(values).toContain("postgresql");
      expect(values).toContain("mongodb");
    });

    it("api decision has expected options", () => {
      const registry = new DecisionRegistry();
      registry.analyzePrompt("I need an api backend");
      const decision = registry.getDecision("api");
      const values = decision!.options.map((o) => o.value);
      expect(values).toContain("rest");
      expect(values).toContain("graphql");
    });

    it("all decisions start unlocked with null userChoice", () => {
      const registry = new DecisionRegistry();
      const decisions = registry.analyzePrompt("I need a frontend framework and database");
      for (const d of decisions) {
        expect(d.locked).toBe(false);
        expect(d.userChoice).toBeNull();
      }
    });
  });

  describe("lockDecision() edge cases", () => {
    it("locking the same decision twice updates userChoice", () => {
      const registry = new DecisionRegistry();
      registry.analyzePrompt("I need a frontend framework");
      registry.lockDecision("framework", "react");
      registry.lockDecision("framework", "vue");
      const decision = registry.getDecision("framework");
      expect(decision!.userChoice).toBe("vue");
    });
  });
});
