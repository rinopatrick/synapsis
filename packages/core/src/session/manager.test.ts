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
});
