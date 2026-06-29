import { describe, it, expect } from "vitest";
import { LearningEngine } from "./engine";
import type { LearningConfig, QuestionDecision, ProjectContext } from "../types";

const getDefaultConfig = (): LearningConfig => ({
  mode: "learning",
  level: "beginner",
  skipTopics: ["html", "css"],
  skillTracking: true,
  gradualReveal: true,
});

const defaultConfig = getDefaultConfig();

const sampleQuestion: QuestionDecision = {
  id: "q-1",
  topic: "framework",
  category: "architecture",
  question: "Which framework?",
  hint: "Think about ecosystem",
  options: [
    { id: "react", label: "React", description: "Popular", value: "react" },
    { id: "vue", label: "Vue", description: "Easy", value: "vue" },
  ],
  explanation: "Framework matters",
  correctAnswer: "react",
  difficulty: "medium",
};

const sampleContext: ProjectContext = {
  description: "A frontend web app",
  techStack: ["react", "typescript"],
  requirements: ["responsive"],
  currentPhase: "planning",
};

describe("LearningEngine", () => {
  describe("shouldSkip()", () => {
    it("returns true for skipped topics", () => {
      const engine = new LearningEngine(getDefaultConfig());
      expect(engine.shouldSkip("html")).toBe(true);
      expect(engine.shouldSkip("css")).toBe(true);
    });

    it("returns false for non-skipped topics", () => {
      const engine = new LearningEngine(getDefaultConfig());
      expect(engine.shouldSkip("react")).toBe(false);
    });
  });

  describe("getRevealLevel()", () => {
    it("starts at 1", () => {
      const engine = new LearningEngine(getDefaultConfig());
      expect(engine.getRevealLevel("q-1")).toBe(1);
    });
  });

  describe("incrementRevealLevel()", () => {
    it("increments from 1 to 2", () => {
      const engine = new LearningEngine(getDefaultConfig());
      expect(engine.incrementRevealLevel("q-1")).toBe(2);
    });

    it("caps at 3", () => {
      const engine = new LearningEngine(getDefaultConfig());
      engine.incrementRevealLevel("q-1"); // 1 -> 2
      engine.incrementRevealLevel("q-1"); // 2 -> 3
      expect(engine.incrementRevealLevel("q-1")).toBe(3); // stays at 3
    });
  });

  describe("generateQuestion()", () => {
    it("returns null in builder mode", async () => {
      const config = { ...getDefaultConfig(), mode: "builder" as const };
      const engine = new LearningEngine(config);
      const result = await engine.generateQuestion(sampleContext);
      expect(result).toBeNull();
    });

    it("returns a question in learning mode", async () => {
      const engine = new LearningEngine(getDefaultConfig());
      const result = await engine.generateQuestion(sampleContext);
      expect(result).not.toBeNull();
      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("question");
    });
  });

  describe("handleResponse()", () => {
    it("returns correct reveal result with hint at level 1", () => {
      const engine = new LearningEngine(getDefaultConfig());
      const result = engine.handleResponse(sampleQuestion, "react");
      expect(result.level).toBe(2); // increments to 2
      expect(result.isCorrect).toBe(true);
      expect(result.hint).toBe(sampleQuestion.hint);
      expect(result.userAnswer).toBe("react");
    });

    it("returns options at level 2", () => {
      const engine = new LearningEngine(getDefaultConfig());
      engine.incrementRevealLevel("q-1"); // bring to level 2
      const result = engine.handleResponse(sampleQuestion, "vue");
      expect(result.level).toBe(3);
      expect(result.options).toEqual(sampleQuestion.options);
    });

    it("returns full explanation at level 3", () => {
      const engine = new LearningEngine(getDefaultConfig());
      engine.incrementRevealLevel("q-1"); // 2
      engine.incrementRevealLevel("q-1"); // 3
      const result = engine.handleResponse(sampleQuestion, "wrong");
      expect(result.level).toBe(3);
      expect(result.explanation).toBe(sampleQuestion.explanation);
      expect(result.correctAnswer).toBe(sampleQuestion.correctAnswer);
    });
  });

  describe("updateConfig()", () => {
    it("merges config", () => {
      const engine = new LearningEngine(getDefaultConfig());
      engine.updateConfig({ level: "advanced" });
      expect(engine.getConfig().level).toBe("advanced");
      expect(engine.getConfig().mode).toBe(defaultConfig.mode);
    });

    it("preserves unmerged fields", () => {
      const engine = new LearningEngine(getDefaultConfig());
      engine.updateConfig({ skillTracking: false });
      const config = engine.getConfig();
      expect(config.skillTracking).toBe(false);
      expect(config.mode).toBe("learning");
      expect(config.skipTopics).toEqual(["html", "css"]);
    });
  });

  describe("setMode()", () => {
    it("switches from learning to builder", () => {
      const engine = new LearningEngine(getDefaultConfig());
      engine.setMode("builder");
      expect(engine.getConfig().mode).toBe("builder");
    });

    it("switches from builder to learning", () => {
      const config = { ...getDefaultConfig(), mode: "builder" as const };
      const engine = new LearningEngine(config);
      engine.setMode("learning");
      expect(engine.getConfig().mode).toBe("learning");
    });

    it("builder mode causes generateQuestion to return null", async () => {
      const engine = new LearningEngine(getDefaultConfig());
      engine.setMode("builder");
      const result = await engine.generateQuestion(sampleContext);
      expect(result).toBeNull();
    });
  });

  describe("setLevel()", () => {
    it("updates to intermediate", () => {
      const engine = new LearningEngine(getDefaultConfig());
      engine.setLevel("intermediate");
      expect(engine.getConfig().level).toBe("intermediate");
    });

    it("updates to advanced", () => {
      const engine = new LearningEngine(getDefaultConfig());
      engine.setLevel("advanced");
      expect(engine.getConfig().level).toBe("advanced");
    });

    it("affects generated question difficulty", async () => {
      const engine = new LearningEngine(getDefaultConfig());
      engine.setLevel("advanced");
      const result = await engine.generateQuestion(sampleContext);
      expect(result).not.toBeNull();
      expect(result!.difficulty).toBe("hard");
    });
  });

  describe("addSkipTopic() and removeSkipTopic()", () => {
    it("adds a new skip topic", () => {
      const engine = new LearningEngine(getDefaultConfig());
      engine.addSkipTopic("testing");
      expect(engine.shouldSkip("testing")).toBe(true);
      expect(engine.getConfig().skipTopics).toContain("testing");
    });

    it("does not duplicate existing skip topic", () => {
      const engine = new LearningEngine(getDefaultConfig());
      engine.addSkipTopic("html");
      const topics = engine.getConfig().skipTopics.filter((t) => t === "html");
      expect(topics).toHaveLength(1);
    });

    it("removes a skip topic", () => {
      const engine = new LearningEngine(getDefaultConfig());
      engine.removeSkipTopic("html");
      expect(engine.shouldSkip("html")).toBe(false);
      expect(engine.shouldSkip("css")).toBe(true);
    });

    it("removing non-existent topic is a no-op", () => {
      const engine = new LearningEngine(getDefaultConfig());
      engine.removeSkipTopic("nonexistent");
      expect(engine.getConfig().skipTopics).toEqual(["html", "css"]);
    });
  });

  describe("generateQuestion() with different levels", () => {
    it("beginner generates easy difficulty", async () => {
      const engine = new LearningEngine({ ...getDefaultConfig(), level: "beginner" });
      const result = await engine.generateQuestion(sampleContext);
      expect(result).not.toBeNull();
      expect(result!.difficulty).toBe("easy");
    });

    it("intermediate generates medium difficulty", async () => {
      const engine = new LearningEngine({ ...getDefaultConfig(), level: "intermediate" });
      const result = await engine.generateQuestion(sampleContext);
      expect(result).not.toBeNull();
      expect(result!.difficulty).toBe("medium");
    });

    it("advanced generates hard difficulty", async () => {
      const engine = new LearningEngine({ ...getDefaultConfig(), level: "advanced" });
      const result = await engine.generateQuestion(sampleContext);
      expect(result).not.toBeNull();
      expect(result!.difficulty).toBe("hard");
    });

    it("database context generates database topic", async () => {
      const dbContext: ProjectContext = {
        description: "A database application",
        techStack: ["postgresql"],
        requirements: ["scalable"],
        currentPhase: "planning",
      };
      const engine = new LearningEngine(getDefaultConfig());
      const result = await engine.generateQuestion(dbContext);
      expect(result).not.toBeNull();
      expect(result!.topic).toBe("database");
    });

    it("api context generates api topic", async () => {
      const apiContext: ProjectContext = {
        description: "An API backend service",
        techStack: ["nodejs"],
        requirements: ["REST endpoints"],
        currentPhase: "planning",
      };
      const engine = new LearningEngine(getDefaultConfig());
      const result = await engine.generateQuestion(apiContext);
      expect(result).not.toBeNull();
      expect(result!.topic).toBe("api");
    });
  });

  describe("handleResponse() with incorrect answers", () => {
    it("marks incorrect answer as not correct", () => {
      const engine = new LearningEngine(getDefaultConfig());
      const result = engine.handleResponse(sampleQuestion, "vue");
      expect(result.isCorrect).toBe(false);
      expect(result.userAnswer).toBe("vue");
    });

    it("handles case-insensitive correct answer", () => {
      const engine = new LearningEngine(getDefaultConfig());
      const result = engine.handleResponse(sampleQuestion, "React");
      expect(result.isCorrect).toBe(true);
    });

    it("handles answer matching option label", () => {
      const engine = new LearningEngine(getDefaultConfig());
      const result = engine.handleResponse(sampleQuestion, "React");
      expect(result.isCorrect).toBe(true);
    });

    it("handles answer matching option value", () => {
      const engine = new LearningEngine(getDefaultConfig());
      const result = engine.handleResponse(sampleQuestion, "react");
      expect(result.isCorrect).toBe(true);
    });

    it("empty answer is incorrect", () => {
      const engine = new LearningEngine(getDefaultConfig());
      const result = engine.handleResponse(sampleQuestion, "");
      expect(result.isCorrect).toBe(false);
    });
  });

  describe("shouldSkip() edge cases", () => {
    it("returns false for empty topic", () => {
      const engine = new LearningEngine(getDefaultConfig());
      expect(engine.shouldSkip("")).toBe(false);
    });

    it("is case-sensitive", () => {
      const engine = new LearningEngine(getDefaultConfig());
      expect(engine.shouldSkip("HTML")).toBe(false);
      expect(engine.shouldSkip("html")).toBe(true);
    });
  });

  describe("incrementRevealLevel() edge cases", () => {
    it("different questions have independent reveal levels", () => {
      const engine = new LearningEngine(getDefaultConfig());
      engine.incrementRevealLevel("q-1");
      engine.incrementRevealLevel("q-1");
      expect(engine.getRevealLevel("q-1")).toBe(3);
      expect(engine.getRevealLevel("q-2")).toBe(1);
    });
  });

  describe("getConfig()", () => {
    it("returns a copy, not a reference", () => {
      const engine = new LearningEngine(getDefaultConfig());
      const config1 = engine.getConfig();
      const config2 = engine.getConfig();
      expect(config1).toEqual(config2);
      expect(config1).not.toBe(config2);
    });
  });
});
