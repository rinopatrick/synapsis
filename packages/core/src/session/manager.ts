import type { Session, SessionRecap, Decision, Skill } from "../types";

export class SessionManager {
  private sessions: Map<string, Session> = new Map();
  private currentSession: Session | null = null;

  /**
   * Start a new session
   */
  startSession(userId: string): Session {
    const session: Session = {
      id: this.generateId(),
      userId,
      startTime: new Date(),
      endTime: null,
      decisions: [],
      skillsImproved: [],
      learningPoints: [],
    };

    this.sessions.set(session.id, session);
    this.currentSession = session;
    return session;
  }

  /**
   * End the current session
   */
  endSession(): SessionRecap | null {
    if (!this.currentSession) return null;

    this.currentSession.endTime = new Date();
    const recap = this.generateRecap(this.currentSession);
    this.sessions.set(this.currentSession.id, this.currentSession);
    this.currentSession = null;
    return recap;
  }

  /**
   * Get current session
   */
  getCurrentSession(): Session | null {
    return this.currentSession;
  }

  /**
   * Add a decision to current session
   */
  addDecision(decision: Decision): void {
    if (!this.currentSession) return;
    this.currentSession.decisions.push(decision);
  }

  /**
   * Add skill improvement to current session
   */
  addSkillImprovement(skill: Skill): void {
    if (!this.currentSession) return;

    const existing = this.currentSession.skillsImproved.find(
      (s) => s.id === skill.id
    );
    if (existing) {
      existing.xp = skill.xp;
      existing.level = skill.level;
      existing.mastered = skill.mastered;
    } else {
      this.currentSession.skillsImproved.push(skill);
    }
  }

  /**
   * Add learning point to current session
   */
  addLearningPoint(point: string): void {
    if (!this.currentSession) return;
    this.currentSession.learningPoints.push(point);
  }

  /**
   * Get session by ID
   */
  getSession(sessionId: string): Session | undefined {
    return this.sessions.get(sessionId);
  }

  /**
   * Get all sessions for a user
   */
  getUserSessions(userId: string): Session[] {
    return Array.from(this.sessions.values()).filter(
      (s) => s.userId === userId
    );
  }

  /**
   * Get recent sessions
   */
  getRecentSessions(limit: number = 10): Session[] {
    return Array.from(this.sessions.values())
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
      .slice(0, limit);
  }

  /**
   * Generate session recap
   */
  private generateRecap(session: Session): SessionRecap {
    const duration = session.endTime
      ? Math.round(
          (session.endTime.getTime() - session.startTime.getTime()) / 1000 / 60
        )
      : 0;

    return {
      sessionId: session.id,
      duration,
      decisionsCount: session.decisions.length,
      skillsImproved: session.skillsImproved,
      learningPoints: session.learningPoints,
      nextSteps: this.generateNextSteps(session),
    };
  }

  /**
   * Generate next steps based on session
   */
  private generateNextSteps(session: Session): string[] {
    const steps: string[] = [];

    // Based on decisions made
    const topics = session.decisions.map((d) => d.topic);
    if (topics.includes("framework")) {
      steps.push("Explore framework documentation");
      steps.push("Build a small project with the chosen framework");
    }

    if (topics.includes("database")) {
      steps.push("Practice database queries");
      steps.push("Learn about data modeling");
    }

    // Based on skills improved
    const skills = session.skillsImproved;
    const weakSkills = skills.filter((s) => s.level < 3);
    if (weakSkills.length > 0) {
      steps.push(
        `Practice ${weakSkills.map((s) => s.name).join(", ")} more`
      );
    }

    // Default steps
    if (steps.length === 0) {
      steps.push("Continue practicing");
      steps.push("Try a new challenge");
    }

    return steps;
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get session statistics
   */
  getStats(): {
    totalSessions: number;
    totalDuration: number;
    totalDecisions: number;
    averageDuration: number;
  } {
    const sessions = Array.from(this.sessions.values());
    const totalSessions = sessions.length;
    const totalDuration = sessions.reduce((sum, s) => {
      if (s.endTime) {
        return sum + (s.endTime.getTime() - s.startTime.getTime());
      }
      return sum;
    }, 0);
    const totalDecisions = sessions.reduce(
      (sum, s) => sum + s.decisions.length,
      0
    );
    const averageDuration =
      totalSessions > 0 ? totalDuration / totalSessions : 0;

    return {
      totalSessions,
      totalDuration: Math.round(totalDuration / 1000 / 60), // in minutes
      totalDecisions,
      averageDuration: Math.round(averageDuration / 1000 / 60), // in minutes
    };
  }

  /**
   * Clear all sessions
   */
  clear(): void {
    this.sessions.clear();
    this.currentSession = null;
  }
}

// Re-export types
export type { Session, SessionRecap };
