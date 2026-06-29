"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface Problem {
  file: string;
  line: number;
  column: number;
  severity: "error" | "warning" | "info";
  message: string;
  source?: string;
}

interface ProblemsPanelProps {
  problems?: Problem[];
  onProblemClick?: (problem: Problem) => void;
}

const defaultProblems: Problem[] = [
  {
    file: "src/app/page.tsx",
    line: 5,
    column: 12,
    severity: "warning",
    message: "'Card' is defined but never used.",
    source: "typescript",
  },
  {
    file: "src/components/Button.tsx",
    line: 15,
    column: 8,
    severity: "error",
    message: "Property 'onClick' is missing in type '{ children: string; variant: string; }' but required in type 'ButtonProps'.",
    source: "typescript",
  },
  {
    file: "src/lib/utils.ts",
    line: 8,
    column: 3,
    severity: "info",
    message: "Consider using template literals instead of string concatenation.",
    source: "eslint",
  },
];

export function ProblemsPanel({ problems = defaultProblems, onProblemClick }: ProblemsPanelProps) {
  const [filter, setFilter] = useState<"all" | "error" | "warning" | "info">("all");

  const filteredProblems = filter === "all" 
    ? problems 
    : problems.filter((p) => p.severity === filter);

  const errorCount = problems.filter((p) => p.severity === "error").length;
  const warningCount = problems.filter((p) => p.severity === "warning").length;
  const infoCount = problems.filter((p) => p.severity === "info").length;

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "error": return "❌";
      case "warning": return "⚠️";
      case "info": return "ℹ️";
      default: return "";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "error": return "text-red-400";
      case "warning": return "text-yellow-400";
      case "info": return "text-blue-400";
      default: return "";
    }
  };

  return (
    <div className="h-full bg-[#1e1e1e] flex flex-col">
      {/* Header */}
      <div className="bg-[#252526] px-4 py-1 text-xs text-gray-400 flex items-center justify-between border-b border-[#3c3c3c]">
        <div className="flex items-center gap-4">
          <span className="font-medium">Problems</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter("all")}
              className={cn("hover:text-white", filter === "all" && "text-white")}
            >
              All ({problems.length})
            </button>
            <button
              onClick={() => setFilter("error")}
              className={cn("hover:text-white text-red-400", filter === "error" && "text-white")}
            >
              {errorCount} Errors
            </button>
            <button
              onClick={() => setFilter("warning")}
              className={cn("hover:text-white text-yellow-400", filter === "warning" && "text-white")}
            >
              {warningCount} Warnings
            </button>
            <button
              onClick={() => setFilter("info")}
              className={cn("hover:text-white text-blue-400", filter === "info" && "text-white")}
            >
              {infoCount} Info
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="hover:text-white">Clear</button>
          <button className="hover:text-white">Filter</button>
        </div>
      </div>

      {/* Problems list */}
      <div className="flex-1 overflow-auto">
        {filteredProblems.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
            No problems found
          </div>
        ) : (
          <div className="p-2">
            {filteredProblems.map((problem, index) => (
              <div
                key={index}
                className="flex items-start gap-2 py-1 px-2 hover:bg-[#2a2d2e] cursor-pointer rounded"
                onClick={() => onProblemClick?.(problem)}
              >
                <span className="mt-0.5">{getSeverityIcon(problem.severity)}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-200 truncate">
                    {problem.message}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    <span>{problem.file}</span>
                    <span className="mx-1">[{problem.line}, {problem.column}]</span>
                    {problem.source && <span>({problem.source})</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
