"use client";

import { useState } from "react";
import { useRefactoring } from "@/hooks/use-refactoring";
import { cn } from "@/lib/utils";

interface RefactorPanelProps {
  code: string;
  language?: string;
  onApply: (refactoredCode: string) => void;
}

export function RefactorPanel({ code, language, onApply }: RefactorPanelProps) {
  const { isRefactoring, result, error, refactorCode, clearResult } = useRefactoring();
  const [instruction, setInstruction] = useState("");

  const handleRefactor = async () => {
    await refactorCode(code, language, instruction || undefined);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-[#3c3c3c]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-white">AI Refactoring</span>
          {result && (
            <button onClick={clearResult} className="text-xs text-gray-400 hover:text-white">
              Clear
            </button>
          )}
        </div>

        <textarea
          placeholder="Optional: describe what to improve..."
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          className="w-full h-16 px-2 py-1 text-sm bg-[#3c3c3c] text-white rounded border border-[#505050] focus:border-blue-500 focus:outline-none resize-none mb-2"
        />

        <button
          onClick={handleRefactor}
          disabled={isRefactoring || !code}
          className="w-full px-3 py-1.5 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded disabled:opacity-50"
        >
          {isRefactoring ? "Refactoring..." : "Refactor Code"}
        </button>
      </div>

      <div className="flex-1 overflow-auto p-3">
        {error && <div className="text-sm text-red-400 mb-3">{error}</div>}

        {result && (
          <div className="space-y-4">
            {result.explanation && (
              <div className="text-sm text-gray-300">{result.explanation}</div>
            )}

            {result.changes.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-white mb-2">Changes</h3>
                {result.changes.map((change, i) => (
                  <div key={i} className="mb-2 p-2 bg-[#252526] rounded">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "text-xs px-1.5 py-0.5 rounded",
                          change.type === "improvement"
                            ? "bg-green-500"
                            : change.type === "fix"
                              ? "bg-red-500"
                              : "bg-blue-500"
                        )}
                      >
                        {change.type}
                      </span>
                      {change.line && (
                        <span className="text-xs text-gray-500">Line {change.line}</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-300 mt-1">{change.description}</p>
                  </div>
                ))}
              </div>
            )}

            {result.refactoredCode && (
              <div>
                <h3 className="text-sm font-medium text-white mb-2">Refactored Code</h3>
                <pre className="p-3 bg-[#252526] rounded text-sm text-green-400 font-mono overflow-auto max-h-48">
                  {result.refactoredCode}
                </pre>
                <button
                  onClick={() => onApply(result.refactoredCode)}
                  className="mt-2 w-full px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded"
                >
                  Apply Refactoring
                </button>
              </div>
            )}
          </div>
        )}

        {!result && !error && (
          <div className="text-sm text-gray-500 text-center py-8">
            Click &quot;Refactor Code&quot; to get AI suggestions
          </div>
        )}
      </div>
    </div>
  );
}
