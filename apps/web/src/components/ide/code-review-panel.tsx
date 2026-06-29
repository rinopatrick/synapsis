"use client";

import { useCodeReview } from "@/hooks/use-code-review";
import { cn } from "@/lib/utils";

interface CodeReviewPanelProps {
  code: string;
  language?: string;
}

export function CodeReviewPanel({ code, language }: CodeReviewPanelProps) {
  const { isReviewing, result, error, reviewCode, clearReview } = useCodeReview();

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-[#3c3c3c] flex items-center justify-between">
        <span className="text-sm font-medium text-white">Code Review</span>
        <div className="flex gap-2">
          {result && (
            <button onClick={clearReview} className="text-xs text-gray-400 hover:text-white">
              Clear
            </button>
          )}
          <button
            onClick={() => reviewCode(code, language)}
            disabled={isReviewing || !code}
            className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
          >
            {isReviewing ? "Reviewing..." : "Review Code"}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-3">
        {error && <div className="text-sm text-red-400 mb-3">{error}</div>}

        {result && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "text-2xl font-bold",
                  result.score >= 8
                    ? "text-green-400"
                    : result.score >= 6
                      ? "text-yellow-400"
                      : "text-red-400"
                )}
              >
                {result.score}/10
              </div>
              <div className="text-sm text-gray-400">{result.summary}</div>
            </div>

            {result.issues.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-white mb-2">Issues</h3>
                {result.issues.map((issue, i) => (
                  <div key={i} className="mb-2 p-2 bg-[#252526] rounded">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "text-xs px-1.5 py-0.5 rounded",
                          issue.severity === "error"
                            ? "bg-red-500"
                            : issue.severity === "warning"
                              ? "bg-yellow-500"
                              : "bg-blue-500"
                        )}
                      >
                        {issue.severity}
                      </span>
                      {issue.line && (
                        <span className="text-xs text-gray-500">Line {issue.line}</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-300 mt-1">{issue.message}</p>
                    {issue.suggestion && (
                      <p className="text-xs text-green-400 mt-1">💡 {issue.suggestion}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {result.improvements.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-white mb-2">Improvements</h3>
                <ul className="space-y-1">
                  {result.improvements.map((imp, i) => (
                    <li key={i} className="text-sm text-gray-400">
                      • {imp}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {!result && !error && (
          <div className="text-sm text-gray-500 text-center py-8">
            Click "Review Code" to analyze your code
          </div>
        )}
      </div>
    </div>
  );
}
