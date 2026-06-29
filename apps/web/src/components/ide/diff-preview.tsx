"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface FileChange {
  path: string;
  action: "create" | "modify" | "delete";
  content?: string;
  diff?: string;
}

interface DiffPreviewProps {
  changes: FileChange[];
  onApply: () => void;
  onDiscard: () => void;
  isApplying: boolean;
}

export function DiffPreview({ changes, onApply, onDiscard, isApplying }: DiffPreviewProps) {
  const [expandedFiles, setExpandedFiles] = useState<Set<number>>(new Set(changes.map((_, i) => i)));

  if (changes.length === 0) return null;

  const toggleFile = (index: number) => {
    setExpandedFiles((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const expandAll = () => setExpandedFiles(new Set(changes.map((_, i) => i)));
  const collapseAll = () => setExpandedFiles(new Set());

  const getActionColor = (action: string) => {
    switch (action) {
      case "create":
        return { bg: "bg-green-900/30", badge: "bg-green-500 text-white" };
      case "modify":
        return { bg: "bg-yellow-900/30", badge: "bg-yellow-500 text-black" };
      case "delete":
        return { bg: "bg-red-900/30", badge: "bg-red-500 text-white" };
      default:
        return { bg: "", badge: "" };
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1e1e1e] border border-[#3c3c3c] rounded-lg w-[800px] max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-[#3c3c3c] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-white">AI Proposed Changes</h2>
            <span className="text-sm text-gray-400">{changes.length} file(s)</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={expandAll} className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-[#3c3c3c]">
              Expand All
            </button>
            <button onClick={collapseAll} className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-[#3c3c3c]">
              Collapse All
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-3">
          {changes.map((change, index) => {
            const colors = getActionColor(change.action);
            const isExpanded = expandedFiles.has(index);

            return (
              <div key={index} className="border border-[#3c3c3c] rounded overflow-hidden">
                <button
                  onClick={() => toggleFile(index)}
                  className={cn(
                    "w-full px-3 py-2 flex items-center gap-2 text-sm text-left hover:brightness-110 transition",
                    colors.bg
                  )}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="currentColor"
                    className={cn("text-gray-400 transition-transform", isExpanded && "rotate-90")}
                  >
                    <path d="M4.5 2L8.5 6L4.5 10" />
                  </svg>
                  <span className={cn("px-2 py-0.5 rounded text-xs font-mono font-semibold", colors.badge)}>
                    {change.action.toUpperCase()}
                  </span>
                  <span className="text-white font-mono truncate">{change.path}</span>
                </button>

                {isExpanded && (
                  <div className="border-t border-[#3c3c3c]">
                    {change.diff && (
                      <pre className="p-3 text-xs font-mono overflow-x-auto max-h-[300px] overflow-y-auto bg-[#1a1a1a]">
                        {change.diff.split("\n").map((line, i) => (
                          <div
                            key={i}
                            className={cn(
                              "px-1",
                              line.startsWith("+") && !line.startsWith("+++") && "text-green-400 bg-green-500/10",
                              line.startsWith("-") && !line.startsWith("---") && "text-red-400 bg-red-500/10",
                              line.startsWith("@@") && "text-blue-400 bg-blue-500/10",
                              line.startsWith("+++") && "text-green-300",
                              line.startsWith("---") && "text-red-300"
                            )}
                          >
                            {line}
                          </div>
                        ))}
                      </pre>
                    )}

                    {change.content && change.action === "create" && (
                      <pre className="p-3 text-xs font-mono text-green-400 overflow-x-auto max-h-[300px] overflow-y-auto bg-[#1a1a1a]">
                        {change.content}
                      </pre>
                    )}

                    {change.content && change.action === "modify" && !change.diff && (
                      <pre className="p-3 text-xs font-mono text-gray-300 overflow-x-auto max-h-[300px] overflow-y-auto bg-[#1a1a1a]">
                        {change.content}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t border-[#3c3c3c] flex justify-end gap-3">
          <button
            onClick={onDiscard}
            className="px-4 py-2 text-sm text-gray-300 hover:text-white rounded hover:bg-[#3c3c3c] transition-colors"
            disabled={isApplying}
          >
            Discard
          </button>
          <button
            onClick={onApply}
            disabled={isApplying}
            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50 transition-colors"
          >
            {isApplying ? "Applying..." : `Apply ${changes.length} Change${changes.length !== 1 ? "s" : ""}`}
          </button>
        </div>
      </div>
    </div>
  );
}
