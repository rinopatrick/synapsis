// Config package exports
export const config = {
  appName: "Synapsis",
  appDescription: "AI Learning IDE - Form the connection. Learn the code.",
  version: "1.0.0",
  
  // AI Configuration
  ai: {
    defaultProvider: "ollama" as const,
    defaultModel: "llama2",
    ollamaEndpoint: "http://localhost:11434",
  },
  
  // Learning Configuration
  learning: {
    defaultMode: "learning" as const,
    defaultLevel: "beginner" as const,
    xpPerLevel: 100,
    maxRevealLevel: 3,
  },
  
  // UI Configuration
  ui: {
    sidebarWidth: 256,
    chatMaxHeight: 600,
    defaultTheme: "system" as const,
  },
} as const;
