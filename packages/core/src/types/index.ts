// User & Profile Types
export type UserLevel = "beginner" | "intermediate" | "advanced";

export interface UserProfile {
  id: string;
  name: string;
  level: UserLevel;
  skipTopics: string[];
  skillTracking: boolean;
  gradualReveal: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Learning Mode Types
export type LearningMode = "learning" | "builder";

export interface LearningConfig {
  mode: LearningMode;
  level: UserLevel;
  skipTopics: string[];
  skillTracking: boolean;
  gradualReveal: boolean;
}

// Decision Types
export interface Option {
  id: string;
  label: string;
  description: string;
  value: string;
}

export interface Decision {
  id: string;
  topic: string;
  category: string;
  question: string;
  hint: string;
  options: Option[];
  explanation: string;
  correctAnswer: string;
  difficulty: "easy" | "medium" | "hard";
  locked: boolean;
  userChoice: string | null;
  aiSuggestion: string | null;
}

export interface DecisionRegistry {
  decisions: Map<string, Decision>;
  analyzePrompt(prompt: string): Decision[];
  lockDecision(id: string, value: string): void;
  getPendingDecisions(): Decision[];
}

// Question & Reveal Types
export type RevealLevel = 1 | 2 | 3;

export interface QuestionDecision {
  id: string;
  topic: string;
  category: string;
  question: string;
  hint: string;
  options: Option[];
  explanation: string;
  correctAnswer: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface RevealResult {
  level: RevealLevel;
  hint?: string;
  options?: Option[];
  explanation?: string;
  correctAnswer?: string;
  isCorrect: boolean;
  userAnswer: string;
}

// Skill Types
export interface Skill {
  id: string;
  name: string;
  category: string;
  xp: number;
  level: number;
  mastered: boolean;
  lastPracticed: Date;
}

export interface SkillTree {
  skills: Skill[];
  totalXp: number;
  level: number;
}

// Session Types
export interface Session {
  id: string;
  userId: string;
  startTime: Date;
  endTime: Date | null;
  decisions: Decision[];
  skillsImproved: Skill[];
  learningPoints: string[];
}

export interface SessionRecap {
  sessionId: string;
  duration: number;
  decisionsCount: number;
  skillsImproved: Skill[];
  learningPoints: string[];
  nextSteps: string[];
}

// AI Provider Types
export type AIProviderType = "api" | "local" | "oauth";

export interface AIProviderConfig {
  type: AIProviderType;
  apiKey?: string;
  provider?: "openai" | "anthropic" | "google";
  model?: string;
  localEndpoint?: string;
  oauthProvider?: string;
  oauthToken?: string;
}

export interface AIMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AIResponse {
  content: string;
  decisions?: Decision[];
  hints?: string[];
  explanation?: string;
}

// Collaborative Types
export interface CollaborativeSession {
  id: string;
  hostId: string;
  topic: string;
  participants: string[];
  maxParticipants: number;
  status: "waiting" | "active" | "completed";
  createdAt: Date;
}

// Project Types
export interface ProjectContext {
  description: string;
  techStack: string[];
  requirements: string[];
  currentPhase: string;
}

// Chat Types
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  decisions?: Decision[];
  hints?: string[];
}

// Template Types
export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  techStack: string[];
  challenges: Challenge[];
  learningObjectives: string[];
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  hint: string;
  solution: string;
  xp: number;
}
