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

    it("returns multiple skills in same category", () => {
      const tracker = new SkillTracker();
      const frontend = tracker.getSkillsByCategory("frontend");
      expect(frontend.length).toBeGreaterThanOrEqual(3);
      const names = frontend.map((s) => s.name);
      expect(names).toContain("HTML");
      expect(names).toContain("CSS");
      expect(names).toContain("JavaScript");
    });
  });

  describe("getSkillById()", () => {
    it("returns correct skill", () => {
      const tracker = new SkillTracker();
      const skill = tracker.getSkill("react");
      expect(skill).toBeDefined();
      expect(skill!.name).toBe("React");
      expect(skill!.category).toBe("frontend");
    });

    it("returns undefined for unknown id", () => {
      const tracker = new SkillTracker();
      expect(tracker.getSkill("nonexistent")).toBeUndefined();
    });
  });

  describe("getTotalXP()", () => {
    it("returns 0 initially", () => {
      const tracker = new SkillTracker();
      expect(tracker.getTotalXP()).toBe(0);
    });

    it("sums XP across all skills", () => {
      const tracker = new SkillTracker();
      tracker.addXP("html", 30);
      tracker.addXP("css", 70);
      expect(tracker.getTotalXP()).toBe(100);
    });

    it("updates after adding XP to multiple skills", () => {
      const tracker = new SkillTracker();
      tracker.addXP("html", 50);
      tracker.addXP("javascript", 50);
      tracker.addXP("react", 50);
      expect(tracker.getTotalXP()).toBe(150);
    });
  });

  describe("level up calculation", () => {
    it("stays at level 1 below threshold", () => {
      const tracker = new SkillTracker();
      tracker.addXP("html", 99);
      expect(tracker.getSkill("html")!.level).toBe(1);
    });

    it("reaches level 2 at 100 XP", () => {
      const tracker = new SkillTracker();
      tracker.addXP("html", 100);
      expect(tracker.getSkill("html")!.level).toBe(2);
    });

    it("reaches level 3 at 200 XP", () => {
      const tracker = new SkillTracker();
      tracker.addXP("html", 200);
      expect(tracker.getSkill("html")!.level).toBe(3);
    });

    it("handles multiple addXP calls", () => {
      const tracker = new SkillTracker();
      tracker.addXP("html", 60);
      tracker.addXP("html", 60);
      expect(tracker.getSkill("html")!.level).toBe(2);
      expect(tracker.getSkill("html")!.xp).toBe(120);
    });

    it("reaches mastery at level 10", () => {
      const tracker = new SkillTracker();
      tracker.addXP("html", 900);
      expect(tracker.getSkill("html")!.level).toBe(10);
      expect(tracker.getSkill("html")!.mastered).toBe(true);
    });

    it("not mastered below level 10", () => {
      const tracker = new SkillTracker();
      tracker.addXP("html", 800);
      expect(tracker.getSkill("html")!.mastered).toBe(false);
    });
  });

  describe("getAllSkills()", () => {
    it("returns default skills", () => {
      const tracker = new SkillTracker();
      const skills = tracker.getAllSkills();
      expect(skills.length).toBeGreaterThanOrEqual(10);
    });
  });

  describe("getSkillTree()", () => {
    it("returns skill tree with correct structure", () => {
      const tracker = new SkillTracker();
      const tree = tracker.getSkillTree();
      expect(tree).toHaveProperty("skills");
      expect(tree).toHaveProperty("totalXp");
      expect(tree).toHaveProperty("level");
      expect(tree.skills.length).toBeGreaterThan(0);
    });

    it("totalXp matches getTotalXP()", () => {
      const tracker = new SkillTracker();
      tracker.addXP("html", 50);
      const tree = tracker.getSkillTree();
      expect(tree.totalXp).toBe(tracker.getTotalXP());
    });
  });

  describe("getOverallLevel()", () => {
    it("starts at level 1", () => {
      const tracker = new SkillTracker();
      expect(tracker.getOverallLevel()).toBe(1);
    });

    it("increases with large XP", () => {
      const tracker = new SkillTracker();
      tracker.addXP("html", 1000);
      expect(tracker.getOverallLevel()).toBeGreaterThan(1);
    });
  });

  describe("hasSkill()", () => {
    it("returns true for default skills", () => {
      const tracker = new SkillTracker();
      expect(tracker.hasSkill("html")).toBe(true);
      expect(tracker.hasSkill("react")).toBe(true);
    });

    it("returns false for unknown skill", () => {
      const tracker = new SkillTracker();
      expect(tracker.hasSkill("nonexistent")).toBe(false);
    });
  });

  describe("getMasteredSkills()", () => {
    it("returns empty initially", () => {
      const tracker = new SkillTracker();
      expect(tracker.getMasteredSkills()).toHaveLength(0);
    });

    it("returns mastered skills after enough XP", () => {
      const tracker = new SkillTracker();
      tracker.addXP("html", 900);
      const mastered = tracker.getMasteredSkills();
      expect(mastered).toHaveLength(1);
      expect(mastered[0].id).toBe("html");
    });
  });

  describe("getSkillProgress()", () => {
    it("returns 0 for new skill", () => {
      const tracker = new SkillTracker();
      expect(tracker.getSkillProgress("html")).toBe(0);
    });

    it("returns 0 for unknown skill", () => {
      const tracker = new SkillTracker();
      expect(tracker.getSkillProgress("nonexistent")).toBe(0);
    });

    it("calculates progress within level", () => {
      const tracker = new SkillTracker();
      tracker.addXP("html", 50);
      expect(tracker.getSkillProgress("html")).toBe(50);
    });

    it("resets to 0 after leveling up", () => {
      const tracker = new SkillTracker();
      tracker.addXP("html", 100);
      expect(tracker.getSkillProgress("html")).toBe(0);
    });
  });

  describe("getCategoryProgress()", () => {
    it("returns correct structure", () => {
      const tracker = new SkillTracker();
      const progress = tracker.getCategoryProgress("frontend");
      expect(progress).toHaveProperty("total");
      expect(progress).toHaveProperty("mastered");
      expect(progress).toHaveProperty("averageLevel");
      expect(progress.total).toBeGreaterThan(0);
    });

    it("returns zeros for unknown category", () => {
      const tracker = new SkillTracker();
      const progress = tracker.getCategoryProgress("blockchain");
      expect(progress.total).toBe(0);
      expect(progress.mastered).toBe(0);
      expect(progress.averageLevel).toBe(0);
    });

    it("tracks mastered count correctly", () => {
      const tracker = new SkillTracker();
      tracker.addXP("html", 900);
      const progress = tracker.getCategoryProgress("frontend");
      expect(progress.mastered).toBe(1);
    });
  });

  describe("reset()", () => {
    it("restores default skills", () => {
      const tracker = new SkillTracker();
      tracker.addXP("html", 500);
      tracker.reset();
      expect(tracker.getSkill("html")!.xp).toBe(0);
      expect(tracker.getSkill("html")!.level).toBe(1);
      expect(tracker.getTotalXP()).toBe(0);
    });
  });

  describe("addSkill() edge cases", () => {
    it("overwrites existing skill with same id", () => {
      const tracker = new SkillTracker();
      tracker.addSkill({ id: "html", name: "HTML5", category: "markup" });
      expect(tracker.getSkill("html")!.name).toBe("HTML5");
      expect(tracker.getSkill("html")!.category).toBe("markup");
    });
  });
});
