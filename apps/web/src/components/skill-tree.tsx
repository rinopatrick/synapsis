"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface Skill {
  id: string;
  name: string;
  category: string;
  xp: number;
  level: number;
  mastered: boolean;
}

export interface SkillTreeProps {
  skills: Skill[];
  totalXP: number;
  overallLevel: number;
  onSkillClick?: (skill: Skill) => void;
}

export function SkillTree({
  skills,
  totalXP,
  overallLevel,
  onSkillClick,
}: SkillTreeProps) {
  const categories = Array.from(new Set(skills.map((s) => s.category)));

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "frontend":
        return "🎨";
      case "backend":
        return "⚙️";
      case "database":
        return "🗄️";
      case "devops":
        return "🚀";
      case "testing":
        return "🧪";
      default:
        return "📚";
    }
  };

  const getLevelProgress = (xp: number) => {
    const xpPerLevel = 100;
    return (xp % xpPerLevel) / xpPerLevel * 100;
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Skill Tree</CardTitle>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <span className="text-primary font-bold">⭐ {totalXP}</span>
              <span className="text-muted-foreground">XP</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-primary font-bold">
                🏆 Level {overallLevel}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {categories.map((category) => {
          const categorySkills = skills.filter(
            (s) => s.category === category
          );
          const masteredCount = categorySkills.filter(
            (s) => s.mastered
          ).length;

          return (
            <div key={category} className="space-y-3">
              {/* Category header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>{getCategoryIcon(category)}</span>
                  <h4 className="text-sm font-medium capitalize">
                    {category}
                  </h4>
                </div>
                <span className="text-xs text-muted-foreground">
                  {masteredCount}/{categorySkills.length} mastered
                </span>
              </div>

              {/* Skills grid */}
              <div className="grid grid-cols-2 gap-2">
                {categorySkills.map((skill) => (
                  <div
                    key={skill.id}
                    className={cn(
                      "rounded-lg border p-3 cursor-pointer transition-all hover:scale-[1.02]",
                      skill.mastered
                        ? "bg-primary/10 border-primary/20"
                        : "bg-muted/50 border-muted"
                    )}
                    onClick={() => onSkillClick?.(skill)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        {skill.name}
                      </span>
                      {skill.mastered && (
                        <span className="text-xs">⭐</span>
                      )}
                    </div>

                    {/* Level badge */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        Level {skill.level}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {skill.xp} XP
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{
                          width: `${getLevelProgress(skill.xp)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
