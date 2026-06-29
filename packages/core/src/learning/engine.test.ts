import { describe, it, expect } from "vitest";
import { LearningEngine } from "./engine";
import type { LearningConfig, QuestionDecision, ProjectContext } from "../types";

const defaultConfig: LearningConfig = {
  mode: "learning",
  level: "beginner",
  skipTopics: ["html", "css"],
  skillTracking: true,
  gradualReveal: true,
};

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
      const engine = new LearningEngine(defaultConfig);
      expect(engine.shouldSkip("html")).toBe(true);
      expect(engine.shouldSkip("css")).toBe(true);
    });

    it("returns false for non-skipped topics", () => {
      const engine = new LearningEngine(defaultConfig);
      expect(engine.shouldSkip("react")).toBe(false);
    });
  });

  describe("getRevealLevel()", () => {
    it("starts at 1", () => {
      const engine = new LearningEngine(defaultConfig);
      expect(engine.getRevealLevel("q-1")).toBe(1);
    });
  });

  describe("incrementRevealLevel()", () => {
    it("increments from 1 to 2", () => {
      const engine = new LearningEngine(defaultConfig);
      expect(engine.incrementRevealLevel("q-1")).toBe(2);
    });

    it("caps at 3", () => {
      const engine = new LearningEngine(defaultConfig);
      engine.incrementRevealLevel("q-1"); // 1 -> 2
      engine.incrementRevealLevel("q-1"); // 2 -> 3
      expect(engine.incrementRevealLevel("q-1")).toBe(3); // stays at 3
    });
  });

  describe("generateQuestion()", () => {
    it("returns null in builder mode", async () => {
      const config = { ...defaultConfig, mode: "builder" as const };
      const engine = new LearningEngine(config);
      const result = await engine.generateQuestion(sampleContext);
      expect(result).toBeNull();
    });

    it("returns a question in learning mode", async () => {
      const engine = new LearningEngine(defaultConfig);
      const result = await engine.generateQuestion(sampleContext);
      expect(result).not.toBeNull();
      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("question");
    });
  });

  describe("handleResponse()", () => {
    it("returns correct reveal result with hint at level 1", () => {
      const engine = new LearningEngine(defaultConfig);
      const result = engine.handleResponse(sampleQuestion, "react");
      expect(result.level).toBe(2); // increments to 2
      expect(result.isCorrect).toBe(true);
      expect(result.hint).toBe(sampleQuestion.hint);
      expect(result.userAnswer).toBe("react");
    });

    it("returns options at level 2", () => {
      const engine = new LearningEngine(defaultConfig);
      engine.incrementRevealLevel("q-1"); // bring to level 2
      const result = engine.handleResponse(sampleQuestion, "vue");
      expect(result.level).toBe(3);
      expect(result.options).toEqual(sampleQuestion.options);
    });

    it("returns full explanation at level 3", () => {
      const engine = new LearningEngine(defaultConfig);
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
      const engine = new LearningEngine(defaultConfig);
      engine.updateConfig({ level: "advanced" });
      expect(engine.getConfig().level).toBe("advanced");
      expect(engine.getConfig().mode).toBe(defaultConfig.mode);
    });
  });
});
