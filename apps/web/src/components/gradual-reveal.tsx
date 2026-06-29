"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface RevealStep {
  level: number;
  type: "hint" | "options" | "explanation" | "answer";
  content: string;
}

export interface GradualRevealProps {
  question: string;
  steps: RevealStep[];
  onComplete?: () => void;
}

export function GradualReveal({
  question,
  steps,
  onComplete,
}: GradualRevealProps) {
  const [currentLevel, setCurrentLevel] = useState(1);
  const maxLevel = Math.max(...steps.map((s) => s.level));

  const currentSteps = steps.filter((s) => s.level <= currentLevel);
  const nextStep = steps.find((s) => s.level === currentLevel + 1);

  const handleRevealNext = () => {
    if (currentLevel < maxLevel) {
      setCurrentLevel(currentLevel + 1);
    } else {
      onComplete?.();
    }
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case "hint":
        return "💡";
      case "options":
        return "📋";
      case "explanation":
        return "📝";
      case "answer":
        return "✅";
      default:
        return "❓";
    }
  };

  const getStepLabel = (type: string) => {
    switch (type) {
      case "hint":
        return "Hint";
      case "options":
        return "Options";
      case "explanation":
        return "Explanation";
      case "answer":
        return "Answer";
      default:
        return "Step";
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-lg">{question}</CardTitle>
        <div className="flex items-center gap-1 mt-2">
          {Array.from({ length: maxLevel }, (_, i) => i + 1).map((level) => (
            <div
              key={level}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors",
                level <= currentLevel ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Revealed steps */}
        {currentSteps.map((step) => (
          <div
            key={step.level}
            className="bg-muted/50 rounded-lg p-4 space-y-2 animate-in fade-in slide-in-from-bottom-2"
          >
            <div className="flex items-center gap-2 text-sm font-medium">
              <span>{getStepIcon(step.type)}</span>
              <span>{getStepLabel(step.type)}</span>
              <span className="text-xs text-muted-foreground">
                Level {step.level}
              </span>
            </div>
            <div className="text-sm">{step.content}</div>
          </div>
        ))}

        {/* Reveal next button */}
        {nextStep && (
          <Button
            variant="outline"
            onClick={handleRevealNext}
            className="w-full"
          >
            {nextStep.type === "answer" ? (
              <>Show Answer</>
            ) : (
              <>Reveal {getStepLabel(nextStep.type)}</>
            )}
          </Button>
        )}

        {/* Complete button */}
        {!nextStep && onComplete && (
          <Button onClick={onComplete} className="w-full">
            Continue
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
