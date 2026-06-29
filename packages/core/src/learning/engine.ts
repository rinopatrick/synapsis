import type {
  LearningConfig,
  LearningMode,
  UserLevel,
  QuestionDecision,
  RevealResult,
  RevealLevel,
  ProjectContext,
  Decision,
} from "../types";

export class LearningEngine {
  private config: LearningConfig;
  private revealLevel: Map<string, RevealLevel> = new Map();

  constructor(config: LearningConfig) {
    this.config = config;
  }

  /**
   * Check if a topic should be skipped based on user's whitelist
   */
  shouldSkip(topic: string): boolean {
    return this.config.skipTopics.includes(topic);
  }

  /**
   * Get the current reveal level for a question
   */
  getRevealLevel(questionId: string): RevealLevel {
    return this.revealLevel.get(questionId) || 1;
  }

  /**
   * Increment reveal level for a question
   */
  incrementRevealLevel(questionId: string): RevealLevel {
    const current = this.getRevealLevel(questionId);
    const next = Math.min(current + 1, 3) as RevealLevel;
    this.revealLevel.set(questionId, next);
    return next;
  }

  /**
   * Generate a question based on context and user level
   */
  generateQuestion(context: ProjectContext): QuestionDecision | null {
    // If in builder mode, don't generate learning questions
    if (this.config.mode === "builder") {
      return null;
    }

    // Determine question difficulty based on user level
    const difficulty = this.getDifficultyForLevel();

    // Generate question based on context
    return this.createQuestionFromContext(context, difficulty);
  }

  /**
   * Handle user response and generate reveal result
   */
  handleResponse(
    question: QuestionDecision,
    userAnswer: string
  ): RevealResult {
    const revealLevel = this.incrementRevealLevel(question.id);
    const isCorrect = this.checkAnswer(question, userAnswer);

    const result: RevealResult = {
      level: revealLevel,
      isCorrect,
      userAnswer,
    };

    // Add content based on reveal level
    switch (revealLevel) {
      case 1:
        result.hint = question.hint;
        break;
      case 2:
        result.hint = question.hint;
        result.options = question.options;
        break;
      case 3:
        result.hint = question.hint;
        result.options = question.options;
        result.explanation = question.explanation;
        result.correctAnswer = question.correctAnswer;
        break;
    }

    return result;
  }

  /**
   * Check if an answer is correct
   */
  private checkAnswer(
    question: QuestionDecision,
    userAnswer: string
  ): boolean {
    // Simple string matching for now
    // Can be enhanced with fuzzy matching or AI-based evaluation
    const normalizedAnswer = userAnswer.toLowerCase().trim();
    const normalizedCorrect = question.correctAnswer.toLowerCase().trim();

    // Check if answer matches any option
    const matchedOption = question.options.find(
      (opt) =>
        opt.label.toLowerCase() === normalizedAnswer ||
        opt.value.toLowerCase() === normalizedAnswer
    );

    if (matchedOption) {
      return matchedOption.value.toLowerCase() === normalizedCorrect;
    }

    return normalizedAnswer === normalizedCorrect;
  }

  /**
   * Get difficulty based on user level
   */
  private getDifficultyForLevel(): "easy" | "medium" | "hard" {
    switch (this.config.level) {
      case "beginner":
        return "easy";
      case "intermediate":
        return "medium";
      case "advanced":
        return "hard";
    }
  }

  /**
   * Create a question from project context
   */
  private createQuestionFromContext(
    context: ProjectContext,
    difficulty: "easy" | "medium" | "hard"
  ): QuestionDecision {
    // This is a placeholder implementation
    // In production, this would use AI to generate contextual questions
    const topic = this.detectTopic(context);

    return {
      id: `q-${Date.now()}`,
      topic,
      category: this.getCategoryForTopic(topic),
      question: this.generateQuestionText(topic, context),
      hint: this.generateHint(topic, difficulty),
      options: this.generateOptions(topic),
      explanation: this.generateExplanation(topic),
      correctAnswer: this.getCorrectAnswer(topic),
      difficulty,
    };
  }

  /**
   * Detect the main topic from context
   */
  private detectTopic(context: ProjectContext): string {
    // Simple keyword detection
    const description = context.description.toLowerCase();

    if (description.includes("frontend") || description.includes("ui")) {
      return "framework";
    }
    if (description.includes("database") || description.includes("data")) {
      return "database";
    }
    if (description.includes("api") || description.includes("backend")) {
      return "api";
    }

    return "general";
  }

  /**
   * Get category for a topic
   */
  private getCategoryForTopic(topic: string): string {
    const categoryMap: Record<string, string> = {
      framework: "architecture",
      database: "data",
      api: "backend",
      styling: "frontend",
      testing: "quality",
      general: "planning",
    };

    return categoryMap[topic] || "general";
  }

  /**
   * Generate question text based on topic
   */
  private generateQuestionText(
    topic: string,
    context: ProjectContext
  ): string {
    const questionMap: Record<string, string> = {
      framework: `Untuk project "${context.description}", framework mana yang paling cocok dan mengapa?`,
      database: `Project ini butuh database. Menurutmu, tipe database apa yang paling sesuai?`,
      api: `Untuk API-nya, pendekatan mana yang lebih baik: REST atau GraphQL?`,
      styling: `Bagaimana cara terbaik untuk styling di project ini?`,
      testing: `Strategi testing apa yang cocok untuk project ini?`,
      general: `Langkah pertama apa yang harus diambil untuk project ini?`,
    };

    return questionMap[topic] || questionMap.general;
  }

  /**
   * Generate hint based on topic and difficulty
   */
  private generateHint(
    topic: string,
    difficulty: "easy" | "medium" | "hard"
  ): string {
    const hints: Record<string, Record<string, string>> = {
      framework: {
        easy: "Pertimbangkan framework yang populer dan mudah dipelajari.",
        medium: "Pikirkan tentang ecosystem, performa, dan kebutuhan project.",
        hard: "Evaluasi trade-offs antara fleksibilitas dan opinionated approach.",
      },
      database: {
        easy: "Pikirkan tentang tipe data yang akan disimpan.",
        medium: "Pertimbangkan skala dan pola query yang dibutuhkan.",
        hard: "Evaluasi consistency, availability, dan partition tolerance.",
      },
    };

    return (
      hints[topic]?.[difficulty] ||
      "Pertimbangkan kebutuhan project dan best practices."
    );
  }

  /**
   * Generate options for a topic
   */
  private generateOptions(topic: string): any[] {
    // Placeholder - in production, this would be dynamic
    const optionsMap: Record<string, any[]> = {
      framework: [
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
      ],
      database: [
        {
          id: "postgresql",
          label: "PostgreSQL",
          description: "Relational, ACID compliant",
          value: "postgresql",
        },
        {
          id: "mongodb",
          label: "MongoDB",
          description: "NoSQL, flexible schema",
          value: "mongodb",
        },
        {
          id: "sqlite",
          label: "SQLite",
          description: "Lightweight, file-based",
          value: "sqlite",
        },
      ],
    };

    return optionsMap[topic] || [];
  }

  /**
   * Generate explanation for a topic
   */
  private generateExplanation(topic: string): string {
    const explanationMap: Record<string, string> = {
      framework:
        "Framework menentukan arsitektur dan cara development. Pilih berdasarkan kebutuhan project, tim, dan ecosystem.",
      database:
        "Database mempengaruhi performa dan skala aplikasi. Pertimbangkan tipe data, query patterns, dan kebutuhan scaling.",
    };

    return (
      explanationMap[topic] ||
      "Setiap keputusan memiliki trade-off. Pertimbangkan kebutuhan spesifik project."
    );
  }

  /**
   * Get correct answer for a topic
   */
  private getCorrectAnswer(topic: string): string {
    // In production, this would be context-dependent
    const answerMap: Record<string, string> = {
      framework: "react", // Default recommendation
      database: "postgresql",
    };

    return answerMap[topic] || "";
  }

  /**
   * Update learning config
   */
  updateConfig(config: Partial<LearningConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current config
   */
  getConfig(): LearningConfig {
    return { ...this.config };
  }

  /**
   * Switch between learning and builder mode
   */
  setMode(mode: LearningMode): void {
    this.config.mode = mode;
  }

  /**
   * Update user level
   */
  setLevel(level: UserLevel): void {
    this.config.level = level;
  }

  /**
   * Add topic to skip list
   */
  addSkipTopic(topic: string): void {
    if (!this.config.skipTopics.includes(topic)) {
      this.config.skipTopics.push(topic);
    }
  }

  /**
   * Remove topic from skip list
   */
  removeSkipTopic(topic: string): void {
    this.config.skipTopics = this.config.skipTopics.filter(
      (t) => t !== topic
    );
  }
}

// Re-export types
export type {
  LearningConfig,
  LearningMode,
  UserLevel,
  QuestionDecision,
  RevealResult,
  RevealLevel,
  ProjectContext,
};
