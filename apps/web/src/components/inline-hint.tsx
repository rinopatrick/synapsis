"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface InlineHintProps {
  hint: string;
  level?: 1 | 2 | 3;
  className?: string;
}

export function InlineHint({ hint, level = 1, className }: InlineHintProps) {
  const [revealed, setRevealed] = useState(false);

  const levelConfig = {
    1: {
      label: "Hint",
      icon: "💡",
      color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    },
    2: {
      label: "Detailed Hint",
      icon: "🔍",
      color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    },
    3: {
      label: "Answer",
      icon: "✅",
      color: "bg-green-500/10 text-green-500 border-green-500/20",
    },
  };

  const config = levelConfig[level];

  if (!revealed) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setRevealed(true)}
        className={cn("gap-2", className)}
      >
        <span>{config.icon}</span>
        <span>Show {config.label}</span>
      </Button>
    );
  }

  return (
    <div
      className={cn(
        "rounded-lg p-3 border text-sm animate-in fade-in slide-in-from-top-2",
        config.color,
        className
      )}
    >
      <div className="flex items-center gap-2 font-medium mb-1">
        <span>{config.icon}</span>
        <span>{config.label}</span>
      </div>
      <div>{hint}</div>
    </div>
  );
}

export interface InlineHintGroupProps {
  hints: string[];
  className?: string;
}

export function InlineHintGroup({ hints, className }: InlineHintGroupProps) {
  const [revealedCount, setRevealedCount] = useState(0);

  const handleRevealNext = () => {
    if (revealedCount < hints.length) {
      setRevealedCount(revealedCount + 1);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {hints.slice(0, revealedCount).map((hint, index) => (
        <InlineHint
          key={index}
          hint={hint}
          level={(Math.min(index + 1, 3) as 1 | 2 | 3)}
        />
      ))}

      {revealedCount < hints.length && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleRevealNext}
          className="w-full"
        >
          {revealedCount === 0 ? "Show Hint" : "Show More"}
        </Button>
      )}
    </div>
  );
}
