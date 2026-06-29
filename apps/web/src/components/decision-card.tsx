"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface DecisionOption {
  id: string;
  label: string;
  description: string;
  value: string;
}

export interface DecisionCardProps {
  id: string;
  topic: string;
  question: string;
  hint: string;
  options: DecisionOption[];
  difficulty: "easy" | "medium" | "hard";
  onSelect: (option: DecisionOption) => void;
  onWhy?: () => void;
  onHint?: () => void;
  selectedOption?: string | null;
  locked?: boolean;
}

export function DecisionCard({
  id,
  topic,
  question,
  hint,
  options,
  difficulty,
  onSelect,
  onWhy,
  onHint,
  selectedOption,
  locked = false,
}: DecisionCardProps) {
  const [showHint, setShowHint] = useState(false);
  const [selected, setSelected] = useState<string | null>(
    selectedOption || null
  );

  const handleSelect = (option: DecisionOption) => {
    if (locked) return;
    setSelected(option.id);
    onSelect(option);
  };

  const difficultyColor = {
    easy: "bg-green-500/10 text-green-500 border-green-500/20",
    medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    hard: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  return (
    <Card
      className={cn(
        "w-full max-w-2xl transition-all",
        locked && "opacity-75"
      )}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary capitalize">
              {topic}
            </span>
            <span
              className={cn(
                "text-xs px-2 py-1 rounded-full border",
                difficultyColor[difficulty]
              )}
            >
              {difficulty}
            </span>
          </div>
          {locked && (
            <span className="text-xs text-muted-foreground">Locked</span>
          )}
        </div>
        <CardTitle className="text-lg">{question}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Options */}
        <div className="grid gap-2">
          {options.map((option) => (
            <Button
              key={option.id}
              variant={selected === option.id ? "default" : "outline"}
              className="justify-start h-auto p-4"
              onClick={() => handleSelect(option)}
              disabled={locked}
            >
              <div className="text-left">
                <div className="font-medium">{option.label}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {option.description}
                </div>
              </div>
            </Button>
          ))}
        </div>

        {/* Hint */}
        {showHint && (
          <div className="bg-muted/50 rounded-lg p-3 text-sm">
            <span className="font-medium">Hint:</span> {hint}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {!locked && onHint && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowHint(true);
                onHint();
              }}
            >
              💡 Show Hint
            </Button>
          )}
          {onWhy && (
            <Button variant="ghost" size="sm" onClick={onWhy}>
              🤔 Why?
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
