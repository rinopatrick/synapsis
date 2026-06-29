import { describe, it, expect } from "vitest";
import { SkillTracker } from "./tracker";

describe("SkillTracker", () => {
  describe("addSkill()", () => {
    it("creates new skill with defaults", () => {
      const tracker = new SkillTracker();
      const skill = tracker.addSkill({
        id: "rust",
        name: "Rust",
        category: "backend",
      });

      expect(skill.id).toBe("rust");
      expect(skill.name).toBe("Rust");
      expect(skill.xp).toBe(0);
      expect(skill.level).toBe(1);
      expect(skill.mastered).toBe(false);
    });

    it("makes skill retrievable", () => {
      const tracker = new SkillTracker();
      tracker.addSkill({ id: "go", name: "Go", category: "backend" });
      expect(tracker.hasSkill("go")).toBe(true);
      expect(tracker.getSkill("go")?.name).toBe("Go");
    });
  });

  describe("addXP()", () => {
    it("increases XP", () => {
      const tracker = new SkillTracker();
      const result = tracker.addXP("html", 50);
      expect(result).not.toBeNull();
      expect(result!.xp).toBe(50);
    });

    it("levels up when XP threshold is reached", () => {
      const tracker = new SkillTracker();
      tracker.addXP("html", 100);
      const skill = tracker.getSkill("html");
      expect(skill!.level).toBe(2);
    });

    it("returns null for unknown skill", () => {
      const tracker = new SkillTracker();
      expect(tracker.addXP("nonexistent", 50)).toBeNull();
    });
  });

  describe("getSkillsByCategory()", () => {
    it("filters correctly", () => {
      const tracker = new SkillTracker();
      const frontend = tracker.getSkillsByCategory("frontend");
      expect(frontend.length).toBeGreaterThan(0);
      expect(frontend.every((s) => s.category === "frontend")).toBe(true);
    });

    it("returns empty for unknown category", () => {
      const tracker = new SkillTracker();
      expect(tracker.getSkillsByCategory("blockchain")).toHaveLength(0);
    });
  });
});
