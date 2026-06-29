import { describe, it, expect } from "vitest";
import { SessionManager } from "./manager";

describe("SessionManager", () => {
  describe("startSession()", () => {
    it("returns new session", () => {
      const manager = new SessionManager();
      const session = manager.startSession("user-1");

      expect(session).toBeDefined();
      expect(session.id).toContain("session-");
      expect(session.userId).toBe("user-1");
      expect(session.startTime).toBeInstanceOf(Date);
      expect(session.endTime).toBeNull();
      expect(session.decisions).toEqual([]);
    });

    it("sets as current session", () => {
      const manager = new SessionManager();
      const session = manager.startSession("user-1");
      expect(manager.getCurrentSession()).toBe(session);
    });
  });

  describe("endSession()", () => {
    it("sets endTime and returns recap", () => {
      const manager = new SessionManager();
      manager.startSession("user-1");
      const recap = manager.endSession();

      expect(recap).not.toBeNull();
      expect(recap!.sessionId).toContain("session-");
      expect(recap!.duration).toBeGreaterThanOrEqual(0);
      expect(manager.getCurrentSession()).toBeNull();
    });

    it("returns null when no active session", () => {
      const manager = new SessionManager();
      expect(manager.endSession()).toBeNull();
    });
  });

  describe("multiple sessions", () => {
    it("stores multiple sessions", () => {
      const manager = new SessionManager();
      const session1 = manager.startSession("user-1");
      manager.endSession();
      const session2 = manager.startSession("user-1");
      manager.endSession();

      expect(manager.getSession(session1.id)).toBeDefined();
      expect(manager.getSession(session2.id)).toBeDefined();
      expect(session1.id).not.toBe(session2.id);
    });

    it("getUserSessions returns sessions for specific user", () => {
      const manager = new SessionManager();
      manager.startSession("user-1");
      manager.endSession();
      manager.startSession("user-2");
      manager.endSession();
      manager.startSession("user-1");
      manager.endSession();

      const user1Sessions = manager.getUserSessions("user-1");
      expect(user1Sessions).toHaveLength(2);
      expect(user1Sessions.every((s) => s.userId === "user-1")).toBe(true);
    });

    it("getUserSessions returns empty for unknown user", () => {
      const manager = new SessionManager();
      manager.startSession("user-1");
      manager.endSession();
      expect(manager.getUserSessions("unknown")).toHaveLength(0);
    });
  });

  describe("getSessionRecap()", () => {
    it("returns correct summary with decisions", () => {
      const manager = new SessionManager();
      manager.startSession("user-1");

      const decision = {
        id: "framework",
        topic: "framework",
        category: "architecture",
        question: "Which framework?",
        hint: "Think about ecosystem",
        options: [],
        explanation: "Framework matters",
        correctAnswer: "react",
        difficulty: "medium" as const,
        locked: true,
        userChoice: "react",
        aiSuggestion: null,
      };
      manager.addDecision(decision);

      const recap = manager.endSession();
      expect(recap).not.toBeNull();
      expect(recap!.decisionsCount).toBe(1);
    });

    it("returns empty learning points when none added", () => {
      const manager = new SessionManager();
      manager.startSession("user-1");
      const recap = manager.endSession();
      expect(recap!.learningPoints).toEqual([]);
    });
  });

  describe("addLearningPoint()", () => {
    it("adds learning point to session", () => {
      const manager = new SessionManager();
      manager.startSession("user-1");
      manager.addLearningPoint("Learned about React hooks");
      manager.addLearningPoint("Understood component lifecycle");

      const session = manager.getCurrentSession();
      expect(session!.learningPoints).toHaveLength(2);
      expect(session!.learningPoints).toContain("Learned about React hooks");
    });

    it("does nothing without active session", () => {
      const manager = new SessionManager();
      manager.addLearningPoint("This should be ignored");
      // No error thrown
    });

    it("learning points appear in recap", () => {
      const manager = new SessionManager();
      manager.startSession("user-1");
      manager.addLearningPoint("Learned TypeScript generics");
      const recap = manager.endSession();
      expect(recap!.learningPoints).toContain("Learned TypeScript generics");
    });
  });

  describe("addDecision()", () => {
    it("adds decision to current session", () => {
      const manager = new SessionManager();
      manager.startSession("user-1");

      const decision = {
        id: "database",
        topic: "database",
        category: "data",
        question: "Which database?",
        hint: "Think about data",
        options: [],
        explanation: "Database matters",
        correctAnswer: "postgresql",
        difficulty: "medium" as const,
        locked: true,
        userChoice: "postgresql",
        aiSuggestion: null,
      };
      manager.addDecision(decision);

      const session = manager.getCurrentSession();
      expect(session!.decisions).toHaveLength(1);
      expect(session!.decisions[0].topic).toBe("database");
    });

    it("does nothing without active session", () => {
      const manager = new SessionManager();
      const decision = {
        id: "test",
        topic: "test",
        category: "test",
        question: "test?",
        hint: "test",
        options: [],
        explanation: "test",
        correctAnswer: "test",
        difficulty: "easy" as const,
        locked: false,
        userChoice: null,
        aiSuggestion: null,
      };
      manager.addDecision(decision);
      // No error thrown
    });
  });

  describe("addSkillImprovement()", () => {
    it("adds skill to session", () => {
      const manager = new SessionManager();
      manager.startSession("user-1");

      const skill = {
        id: "react",
        name: "React",
        category: "frontend",
        xp: 100,
        level: 2,
        mastered: false,
        lastPracticed: new Date(),
      };
      manager.addSkillImprovement(skill);

      const session = manager.getCurrentSession();
      expect(session!.skillsImproved).toHaveLength(1);
      expect(session!.skillsImproved[0].name).toBe("React");
    });

    it("updates existing skill improvement", () => {
      const manager = new SessionManager();
      manager.startSession("user-1");

      const skill1 = {
        id: "react",
        name: "React",
        category: "frontend",
        xp: 50,
        level: 1,
        mastered: false,
        lastPracticed: new Date(),
      };
      manager.addSkillImprovement(skill1);

      const skill2 = {
        id: "react",
        name: "React",
        category: "frontend",
        xp: 150,
        level: 2,
        mastered: false,
        lastPracticed: new Date(),
      };
      manager.addSkillImprovement(skill2);

      const session = manager.getCurrentSession();
      expect(session!.skillsImproved).toHaveLength(1);
      expect(session!.skillsImproved[0].xp).toBe(150);
      expect(session!.skillsImproved[0].level).toBe(2);
    });
  });

  describe("getSession()", () => {
    it("returns session by id", () => {
      const manager = new SessionManager();
      const session = manager.startSession("user-1");
      manager.endSession();

      const found = manager.getSession(session.id);
      expect(found).toBeDefined();
      expect(found!.id).toBe(session.id);
    });

    it("returns undefined for unknown id", () => {
      const manager = new SessionManager();
      expect(manager.getSession("nonexistent")).toBeUndefined();
    });
  });

  describe("getRecentSessions()", () => {
    it("returns sessions in reverse chronological order", () => {
      const manager = new SessionManager();
      manager.startSession("user-1");
      manager.endSession();
      manager.startSession("user-1");
      manager.endSession();
      manager.startSession("user-1");
      manager.endSession();

      const recent = manager.getRecentSessions(2);
      expect(recent).toHaveLength(2);
      expect(recent[0].startTime.getTime()).toBeGreaterThanOrEqual(
        recent[1].startTime.getTime()
      );
    });

    it("returns empty when no sessions", () => {
      const manager = new SessionManager();
      expect(manager.getRecentSessions()).toHaveLength(0);
    });
  });

  describe("getStats()", () => {
    it("returns correct stats", () => {
      const manager = new SessionManager();
      manager.startSession("user-1");
      manager.addDecision({
        id: "test",
        topic: "test",
        category: "test",
        question: "test?",
        hint: "test",
        options: [],
        explanation: "test",
        correctAnswer: "test",
        difficulty: "easy",
        locked: false,
        userChoice: null,
        aiSuggestion: null,
      });
      manager.endSession();

      const stats = manager.getStats();
      expect(stats.totalSessions).toBe(1);
      expect(stats.totalDecisions).toBe(1);
      expect(stats.totalDuration).toBeGreaterThanOrEqual(0);
    });

    it("returns zero stats when empty", () => {
      const manager = new SessionManager();
      const stats = manager.getStats();
      expect(stats.totalSessions).toBe(0);
      expect(stats.totalDuration).toBe(0);
      expect(stats.totalDecisions).toBe(0);
      expect(stats.averageDuration).toBe(0);
    });
  });

  describe("clear()", () => {
    it("removes all sessions and current session", () => {
      const manager = new SessionManager();
      manager.startSession("user-1");
      manager.startSession("user-2");
      manager.clear();

      expect(manager.getCurrentSession()).toBeNull();
      expect(manager.getRecentSessions()).toHaveLength(0);
    });
  });

  describe("endSession() sets endTime", () => {
    it("endTime is set after ending session", () => {
      const manager = new SessionManager();
      const session = manager.startSession("user-1");
      expect(session.endTime).toBeNull();
      manager.endSession();
      expect(session.endTime).toBeInstanceOf(Date);
    });
  });
});
