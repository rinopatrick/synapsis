"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface CodeIssue {
  line: number;
  severity: "error" | "warning" | "info";
  message: string;
  suggestion?: string;
}

export interface CodeReviewProps {
  code: string;
  language: string;
  issues?: CodeIssue[];
  onExplain?: (line: number) => void;
  onFix?: (issue: CodeIssue) => void;
}

export function CodeReview({
  code,
  language,
  issues = [],
  onExplain,
  onFix,
}: CodeReviewProps) {
  const [selectedLine, setSelectedLine] = useState<number | null>(null);

  const lines = code.split("\n");

  const getLineIssues = (lineNumber: number) => {
    return issues.filter((issue) => issue.line === lineNumber);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "error":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "warning":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "info":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default:
        return "";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      case "info":
        return "ℹ️";
      default:
        return "";
    }
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Code Review</CardTitle>
          <span className="text-xs px-2 py-1 rounded-full bg-muted capitalize">
            {language}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Code display */}
        <div className="bg-muted rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <pre className="text-sm p-4">
              {lines.map((line, index) => {
                const lineNumber = index + 1;
                const lineIssues = getLineIssues(lineNumber);
                const hasIssues = lineIssues.length > 0;
                const isSelected = selectedLine === lineNumber;

                return (
                  <div
                    key={lineNumber}
                    className={cn(
                      "flex items-start gap-4 px-2 py-0.5 rounded-sm transition-colors cursor-pointer",
                      hasIssues && "bg-red-500/5",
                      isSelected && "bg-primary/10",
                      "hover:bg-muted/80"
                    )}
                    onClick={() => setSelectedLine(lineNumber)}
                  >
                    {/* Line number */}
                    <span className="text-xs text-muted-foreground w-8 text-right select-none shrink-0">
                      {lineNumber}
                    </span>

                    {/* Code */}
                    <code className="flex-1 font-mono whitespace-pre">
                      {line}
                    </code>

                    {/* Issue indicator */}
                    {hasIssues && (
                      <span className="text-xs shrink-0">
                        {getSeverityIcon(lineIssues[0].severity)}
                      </span>
                    )}
                  </div>
                );
              })}
            </pre>
          </div>
        </div>

        {/* Issues panel */}
        {selectedLine && getLineIssues(selectedLine).length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">
              Issues on line {selectedLine}
            </h4>
            {getLineIssues(selectedLine).map((issue, index) => (
              <div
                key={index}
                className={cn(
                  "rounded-lg p-3 border",
                  getSeverityColor(issue.severity)
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">
                      {issue.message}
                    </div>
                    {issue.suggestion && (
                      <div className="text-xs text-muted-foreground">
                        Suggestion: {issue.suggestion}
                      </div>
                    )}
                  </div>
                  {onFix && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onFix(issue)}
                    >
                      Fix
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {selectedLine && onExplain && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onExplain(selectedLine)}
            >
              📖 Explain line {selectedLine}
            </Button>
          )}
        </div>

        {/* Summary */}
        {issues.length > 0 && (
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="text-sm font-medium">Summary</div>
            <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
              <span>
                {issues.filter((i) => i.severity === "error").length} errors
              </span>
              <span>
                {issues.filter((i) => i.severity === "warning").length} warnings
              </span>
              <span>
                {issues.filter((i) => i.severity === "info").length} info
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
