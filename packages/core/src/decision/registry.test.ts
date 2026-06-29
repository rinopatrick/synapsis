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
    it("returns unlocked decisions", () => {
      const registry = new DecisionRegistry();
      registry.analyzePrompt("I need a frontend framework and database");
      registry.lockDecision("framework", "react");

      const pending = registry.getPendingDecisions();
      expect(pending.every((d) => !d.locked)).toBe(true);
      expect(pending.find((d) => d.id === "framework")).toBeUndefined();
      expect(pending.find((d) => d.id === "database")).toBeDefined();
    });

    it("returns empty when all are locked", () => {
      const registry = new DecisionRegistry();
      registry.analyzePrompt("I need a frontend framework");
      registry.lockDecision("framework", "react");

      expect(registry.getPendingDecisions()).toHaveLength(0);
    });
  });
});
