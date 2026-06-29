"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface SessionRecapProps {
  duration: number; // in minutes
  decisionsCount: number;
  skillsImproved: {
    name: string;
    xpGained: number;
    newLevel?: number;
  }[];
  learningPoints: string[];
  nextSteps: string[];
  onClose?: () => void;
  onContinue?: () => void;
}

export function SessionRecap({
  duration,
  decisionsCount,
  skillsImproved,
  learningPoints,
  nextSteps,
  onClose,
  onContinue,
}: SessionRecapProps) {
  const totalXP = skillsImproved.reduce((sum, s) => sum + s.xpGained, 0);

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <div className="text-center">
          <div className="text-4xl mb-2">🎉</div>
          <CardTitle className="text-2xl">Session Complete!</CardTitle>
          <p className="text-muted-foreground mt-1">
            Great work! Here&apos;s what you accomplished.
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="text-2xl font-bold text-primary">
              {duration}
            </div>
            <div className="text-xs text-muted-foreground">Minutes</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="text-2xl font-bold text-primary">
              {decisionsCount}
            </div>
            <div className="text-xs text-muted-foreground">Decisions</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="text-2xl font-bold text-primary">+{totalXP}</div>
            <div className="text-xs text-muted-foreground">XP Gained</div>
          </div>
        </div>

        {/* Skills improved */}
        {skillsImproved.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Skills Improved</h4>
            <div className="space-y-2">
              {skillsImproved.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-muted/50 rounded-lg p-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">⭐</span>
                    <span className="text-sm font-medium">{skill.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-green-500">
                      +{skill.xpGained} XP
                    </span>
                    {skill.newLevel && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        Level {skill.newLevel}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Learning points */}
        {learningPoints.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">What You Learned</h4>
            <ul className="space-y-2">
              {learningPoints.map((point, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="text-primary mt-0.5">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Next steps */}
        {nextSteps.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Next Steps</h4>
            <ul className="space-y-2">
              {nextSteps.map((step, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm"
                >
                  <span className="text-muted-foreground mt-0.5">
                    {index + 1}.
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {onClose && (
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
          )}
          {onContinue && (
            <Button onClick={onContinue} className="flex-1">
              Continue Learning
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
