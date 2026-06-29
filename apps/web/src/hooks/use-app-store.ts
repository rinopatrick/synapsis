import { create } from "zustand";
import type { AIConfig, AIProviderType } from "@/lib/ai";

interface AppState {
  // AI Configuration
  aiConfig: AIConfig;
  setAIConfig: (config: Partial<AIConfig>) => void;

  // Learning Mode
  learningMode: "learning" | "builder";
  setLearningMode: (mode: "learning" | "builder") => void;

  // User Level
  userLevel: "beginner" | "intermediate" | "advanced";
  setUserLevel: (level: "beginner" | "intermediate" | "advanced") => void;

  // Skip Topics
  skipTopics: string[];
  addSkipTopic: (topic: string) => void;
  removeSkipTopic: (topic: string) => void;

  // UI State
  sidebarOpen: boolean;
  toggleSidebar: () => void;

  // Chat State
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // AI Configuration
  aiConfig: {
    provider: "ollama",
    model: "llama2",
  },
  setAIConfig: (config) =>
    set((state) => ({
      aiConfig: { ...state.aiConfig, ...config },
    })),

  // Learning Mode
  learningMode: "learning",
  setLearningMode: (mode) => set({ learningMode: mode }),

  // User Level
  userLevel: "beginner",
  setUserLevel: (level) => set({ userLevel: level }),

  // Skip Topics
  skipTopics: [],
  addSkipTopic: (topic) =>
    set((state) => ({
      skipTopics: [...state.skipTopics, topic],
    })),
  removeSkipTopic: (topic) =>
    set((state) => ({
      skipTopics: state.skipTopics.filter((t) => t !== topic),
    })),

  // UI State
  sidebarOpen: true,
  toggleSidebar: () =>
    set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  // Chat State
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
