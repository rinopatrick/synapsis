import type { Skill, SkillTree } from "../types";

export class SkillTracker {
  private skills: Map<string, Skill> = new Map();
  private xpPerLevel: number = 100;

  constructor() {
    this.initializeDefaultSkills();
  }

  /**
   * Initialize default skills
   */
  private initializeDefaultSkills(): void {
    const defaultSkills: Skill[] = [
      // Frontend skills
      {
        id: "html",
        name: "HTML",
        category: "frontend",
        xp: 0,
        level: 1,
        mastered: false,
        lastPracticed: new Date(),
      },
      {
        id: "css",
        name: "CSS",
        category: "frontend",
        xp: 0,
        level: 1,
        mastered: false,
        lastPracticed: new Date(),
      },
      {
        id: "javascript",
        name: "JavaScript",
        category: "frontend",
        xp: 0,
        level: 1,
        mastered: false,
        lastPracticed: new Date(),
      },
      {
        id: "typescript",
        name: "TypeScript",
        category: "frontend",
        xp: 0,
        level: 1,
        mastered: false,
        lastPracticed: new Date(),
      },
      {
        id: "react",
        name: "React",
        category: "frontend",
        xp: 0,
        level: 1,
        mastered: false,
        lastPracticed: new Date(),
      },
      // Backend skills
      {
        id: "nodejs",
        name: "Node.js",
        category: "backend",
        xp: 0,
        level: 1,
        mastered: false,
        lastPracticed: new Date(),
      },
      {
        id: "express",
        name: "Express",
        category: "backend",
        xp: 0,
        level: 1,
        mastered: false,
        lastPracticed: new Date(),
      },
      {
        id: "restapi",
        name: "REST API",
        category: "backend",
        xp: 0,
        level: 1,
        mastered: false,
        lastPracticed: new Date(),
      },
      // Database skills
      {
        id: "sql",
        name: "SQL",
        category: "database",
        xp: 0,
        level: 1,
        mastered: false,
        lastPracticed: new Date(),
      },
      {
        id: "postgresql",
        name: "PostgreSQL",
        category: "database",
        xp: 0,
        level: 1,
        mastered: false,
        lastPracticed: new Date(),
      },
      // DevOps skills
      {
        id: "git",
        name: "Git",
        category: "devops",
        xp: 0,
        level: 1,
        mastered: false,
        lastPracticed: new Date(),
      },
      {
        id: "docker",
        name: "Docker",
        category: "devops",
        xp: 0,
        level: 1,
        mastered: false,
        lastPracticed: new Date(),
      },
      // Testing skills
      {
        id: "unittesting",
        name: "Unit Testing",
        category: "testing",
        xp: 0,
        level: 1,
        mastered: false,
        lastPracticed: new Date(),
      },
      {
        id: "integrationtesting",
        name: "Integration Testing",
        category: "testing",
        xp: 0,
        level: 1,
        mastered: false,
        lastPracticed: new Date(),
      },
    ];

    defaultSkills.forEach((skill) => this.skills.set(skill.id, skill));
  }

  /**
   * Add XP to a skill
   */
  addXP(skillId: string, xp: number): Skill | null {
    const skill = this.skills.get(skillId);
    if (!skill) return null;

    skill.xp += xp;
    skill.lastPracticed = new Date();

    // Check for level up
    const newLevel = Math.floor(skill.xp / this.xpPerLevel) + 1;
    if (newLevel > skill.level) {
      skill.level = newLevel;
    }

    // Check for mastery (level 10)
    if (skill.level >= 10) {
      skill.mastered = true;
    }

    this.skills.set(skillId, skill);
    return skill;
  }

  /**
   * Get a skill by ID
   */
  getSkill(skillId: string): Skill | undefined {
    return this.skills.get(skillId);
  }

  /**
   * Get all skills
   */
  getAllSkills(): Skill[] {
    return Array.from(this.skills.values());
  }

  /**
   * Get skills by category
   */
  getSkillsByCategory(category: string): Skill[] {
    return Array.from(this.skills.values()).filter(
      (s) => s.category === category
    );
  }

  /**
   * Get skill tree summary
   */
  getSkillTree(): SkillTree {
    const skills = this.getAllSkills();
    const totalXp = skills.reduce((sum, s) => sum + s.xp, 0);
    const level = Math.floor(totalXp / (this.xpPerLevel * 10)) + 1;

    return {
      skills,
      totalXp,
      level,
    };
  }

  /**
   * Get total XP
   */
  getTotalXP(): number {
    return Array.from(this.skills.values()).reduce(
      (sum, s) => sum + s.xp,
      0
    );
  }

  /**
   * Get overall level
   */
  getOverallLevel(): number {
    return Math.floor(this.getTotalXP() / (this.xpPerLevel * 10)) + 1;
  }

  /**
   * Add a new skill
   */
  addSkill(skill: Omit<Skill, "xp" | "level" | "mastered" | "lastPracticed">): Skill {
    const newSkill: Skill = {
      ...skill,
      xp: 0,
      level: 1,
      mastered: false,
      lastPracticed: new Date(),
    };

    this.skills.set(newSkill.id, newSkill);
    return newSkill;
  }

  /**
   * Check if a skill exists
   */
  hasSkill(skillId: string): boolean {
    return this.skills.has(skillId);
  }

  /**
   * Get mastered skills
   */
  getMasteredSkills(): Skill[] {
    return Array.from(this.skills.values()).filter((s) => s.mastered);
  }

  /**
   * Get skills that need practice
   */
  getSkillsNeedingPractice(daysThreshold: number = 7): Skill[] {
    const threshold = new Date();
    threshold.setDate(threshold.getDate() - daysThreshold);

    return Array.from(this.skills.values()).filter(
      (s) => s.lastPracticed < threshold
    );
  }

  /**
   * Get skill progress percentage
   */
  getSkillProgress(skillId: string): number {
    const skill = this.skills.get(skillId);
    if (!skill) return 0;

    const xpForCurrentLevel = (skill.level - 1) * this.xpPerLevel;
    const xpInCurrentLevel = skill.xp - xpForCurrentLevel;
    return (xpInCurrentLevel / this.xpPerLevel) * 100;
  }

  /**
   * Get category progress
   */
  getCategoryProgress(category: string): {
    total: number;
    mastered: number;
    averageLevel: number;
  } {
    const skills = this.getSkillsByCategory(category);
    const mastered = skills.filter((s) => s.mastered).length;
    const averageLevel =
      skills.reduce((sum, s) => sum + s.level, 0) / skills.length || 0;

    return {
      total: skills.length,
      mastered,
      averageLevel: Math.round(averageLevel * 10) / 10,
    };
  }

  /**
   * Reset all skills
   */
  reset(): void {
    this.skills.clear();
    this.initializeDefaultSkills();
  }
}

// Re-export types
export type { Skill, SkillTree };
