// Browser-compatible storage using localStorage
// For server-side, we'll use a simple in-memory store

type StorageValue = string | number | boolean | object | null;

class BrowserStorage {
  private prefix = "synapsis_";

  get<T>(key: string): T | null {
    if (typeof window === "undefined") return null;
    
    try {
      const value = localStorage.getItem(this.prefix + key);
      if (value === null) return null;
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    if (typeof window === "undefined") return;
    
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value));
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
    }
  }

  remove(key: string): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(this.prefix + key);
  }

  clear(): void {
    if (typeof window === "undefined") return;
    
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  }
}

export const storage = new BrowserStorage();

// Database schema types (for type safety)
export interface DBUser {
  id: string;
  name: string;
  level: "beginner" | "intermediate" | "advanced";
  skillTracking: boolean;
  gradualReveal: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DBSession {
  id: string;
  userId: string;
  startTime: string;
  endTime: string | null;
  decisionsCount: number;
  learningPointsCount: number;
}

export interface DBDecision {
  id: string;
  sessionId: string;
  topic: string;
  category: string;
  question: string;
  hint: string;
  options: string; // JSON
  explanation: string;
  correctAnswer: string;
  difficulty: "easy" | "medium" | "hard";
  locked: boolean;
  userChoice: string | null;
  aiSuggestion: string | null;
  createdAt: string;
}

export interface DBSkill {
  id: string;
  userId: string;
  name: string;
  category: string;
  xp: number;
  level: number;
  mastered: boolean;
  lastPracticed: string;
}
