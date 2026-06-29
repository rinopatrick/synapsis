"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export interface WhyButtonProps {
  topic: string;
  answer: string;
  explanation: string;
  tradeoffs?: string[];
  className?: string;
}

export function WhyButton({
  topic,
  answer,
  explanation,
  tradeoffs,
  className,
}: WhyButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className={cn("gap-2", className)}>
          <span>🤔</span>
          <span>Why?</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Why this matters</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Topic */}
          <div className="bg-primary/10 rounded-lg p-3">
            <div className="text-sm font-medium text-primary capitalize">
              {topic}
            </div>
            <div className="text-lg font-semibold mt-1">{answer}</div>
          </div>

          {/* Explanation */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Explanation</h4>
            <p className="text-sm text-muted-foreground">{explanation}</p>
          </div>

          {/* Trade-offs */}
          {tradeoffs && tradeoffs.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Trade-offs to consider</h4>
              <ul className="space-y-1">
                {tradeoffs.map((tradeoff, index) => (
                  <li
                    key={index}
                    className="text-sm text-muted-foreground flex items-start gap-2"
                  >
                    <span className="text-primary mt-0.5">•</span>
                    <span>{tradeoff}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Learning tip */}
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="text-xs font-medium text-muted-foreground">
              💡 Learning Tip
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Understanding the &ldquo;why&rdquo; behind decisions helps you
              make better choices in future projects. Each choice has trade-offs
              — the key is knowing when each approach is appropriate.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
