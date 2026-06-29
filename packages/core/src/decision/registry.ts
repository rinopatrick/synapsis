import type { Decision, Option, ProjectContext } from "../types";

export class DecisionRegistry {
  private decisions: Map<string, Decision> = new Map();

  /**
   * Analyze a user prompt and detect required decisions
   */
  analyzePrompt(prompt: string, context?: ProjectContext): Decision[] {
    const decisions: Decision[] = [];
    const lowerPrompt = prompt.toLowerCase();

    // Detect framework decisions
    if (
      lowerPrompt.includes("frontend") ||
      lowerPrompt.includes("ui") ||
      lowerPrompt.includes("web")
    ) {
      decisions.push(this.createFrameworkDecision(context));
    }

    // Detect database decisions
    if (
      lowerPrompt.includes("database") ||
      lowerPrompt.includes("data") ||
      lowerPrompt.includes("storage")
    ) {
      decisions.push(this.createDatabaseDecision(context));
    }

    // Detect API decisions
    if (
      lowerPrompt.includes("api") ||
      lowerPrompt.includes("backend") ||
      lowerPrompt.includes("server")
    ) {
      decisions.push(this.createAPIDecision(context));
    }

    // Detect styling decisions
    if (
      lowerPrompt.includes("style") ||
      lowerPrompt.includes("css") ||
      lowerPrompt.includes("design")
    ) {
      decisions.push(this.createStylingDecision(context));
    }

    // Store decisions
    decisions.forEach((d) => this.decisions.set(d.id, d));

    return decisions;
  }

  /**
   * Lock a decision with user's choice
   */
  lockDecision(id: string, value: string): void {
    const decision = this.decisions.get(id);
    if (decision) {
      decision.locked = true;
      decision.userChoice = value;
      this.decisions.set(id, decision);
    }
  }

  /**
   * Get all pending (unlocked) decisions
   */
  getPendingDecisions(): Decision[] {
    return Array.from(this.decisions.values()).filter((d) => !d.locked);
  }

  /**
   * Get all decisions
   */
  getAllDecisions(): Decision[] {
    return Array.from(this.decisions.values());
  }

  /**
   * Get a specific decision by ID
   */
  getDecision(id: string): Decision | undefined {
    return this.decisions.get(id);
  }

  /**
   * Check if all required decisions are locked
   */
  allRequiredLocked(): boolean {
    return Array.from(this.decisions.values())
      .filter((d) => d.category !== "optional")
      .every((d) => d.locked);
  }

  /**
   * Clear all decisions
   */
  clear(): void {
    this.decisions.clear();
  }

  /**
   * Create framework decision
   */
  private createFrameworkDecision(context?: ProjectContext): Decision {
    return {
      id: "framework",
      topic: "framework",
      category: "architecture",
      question: "Framework mana yang akan digunakan?",
      hint: "Pertimbangkan popularitas, learning curve, dan kebutuhan project.",
      options: [
        {
          id: "react",
          label: "React",
          description: "Populer, ecosystem besar, flexible",
          value: "react",
        },
        {
          id: "vue",
          label: "Vue",
          description: "Mudah dipelajari, documentation bagus",
          value: "vue",
        },
        {
          id: "svelte",
          label: "Svelte",
          description: "Performa tinggi, syntax clean",
          value: "svelte",
        },
        {
          id: "nextjs",
          label: "Next.js",
          description: "Full-stack React framework, SSR/SSG",
          value: "nextjs",
        },
      ],
      explanation:
        "Framework menentukan arsitektur dan cara development. Pilih berdasarkan kebutuhan project, tim, dan ecosystem.",
      correctAnswer: "react", // Default recommendation
      difficulty: "medium",
      locked: false,
      userChoice: null,
      aiSuggestion: null,
    };
  }

  /**
   * Create database decision
   */
  private createDatabaseDecision(context?: ProjectContext): Decision {
    return {
      id: "database",
      topic: "database",
      category: "data",
      question: "Database apa yang akan digunakan?",
      hint: "Pertimbangkan tipe data, skala, dan query patterns.",
      options: [
        {
          id: "postgresql",
          label: "PostgreSQL",
          description: "Relational, ACID compliant, feature-rich",
          value: "postgresql",
        },
        {
          id: "mysql",
          label: "MySQL",
          description: "Populer, mudah digunakan, widely supported",
          value: "mysql",
        },
        {
          id: "mongodb",
          label: "MongoDB",
          description: "NoSQL, flexible schema, document-based",
          value: "mongodb",
        },
        {
          id: "sqlite",
          label: "SQLite",
          description: "Lightweight, file-based, zero config",
          value: "sqlite",
        },
      ],
      explanation:
        "Database mempengaruhi performa dan skala aplikasi. Pertimbangkan tipe data, query patterns, dan kebutuhan scaling.",
      correctAnswer: "postgresql",
      difficulty: "medium",
      locked: false,
      userChoice: null,
      aiSuggestion: null,
    };
  }

  /**
   * Create API decision
   */
  private createAPIDecision(context?: ProjectContext): Decision {
    return {
      id: "api",
      topic: "api",
      category: "backend",
      question: "Pendekatan API mana yang akan digunakan?",
      hint: "Pertimbangkan kebutuhan client, kompleksitas data, dan performa.",
      options: [
        {
          id: "rest",
          label: "REST",
          description: "Standar, mudah dipahami, widely adopted",
          value: "rest",
        },
        {
          id: "graphql",
          label: "GraphQL",
          description: "Flexible queries, kurangi over-fetching",
          value: "graphql",
        },
        {
          id: "trpc",
          label: "tRPC",
          description: "Type-safe, end-to-end typescript",
          value: "trpc",
        },
      ],
      explanation:
        "Pendekatan API menentukan cara client-server berkomunikasi. Pilih berdasarkan kebutuhan data dan developer experience.",
      correctAnswer: "rest",
      difficulty: "medium",
      locked: false,
      userChoice: null,
      aiSuggestion: null,
    };
  }

  /**
   * Create styling decision
   */
  private createStylingDecision(context?: ProjectContext): Decision {
    return {
      id: "styling",
      topic: "styling",
      category: "frontend",
      question: "Bagaimana cara styling yang akan digunakan?",
      hint: "Pertimbangkan maintainability, performa, dan tim.",
      options: [
        {
          id: "tailwind",
          label: "Tailwind CSS",
          description: "Utility-first, cepat development",
          value: "tailwind",
        },
        {
          id: "css-modules",
          label: "CSS Modules",
          description: "Scoped CSS, native browser support",
          value: "css-modules",
        },
        {
          id: "styled-components",
          label: "Styled Components",
          description: "CSS-in-Js, dynamic styling",
          value: "styled-components",
        },
      ],
      explanation:
        "Styling approach mempengaruhi maintainability dan developer experience. Pilih berdasarkan preferensi tim dan kebutuhan project.",
      correctAnswer: "tailwind",
      difficulty: "easy",
      locked: false,
      userChoice: null,
      aiSuggestion: null,
    };
  }
}

// Re-export types
export type { Decision, Option, ProjectContext };
