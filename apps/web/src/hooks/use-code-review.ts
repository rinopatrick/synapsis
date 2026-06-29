import { useState, useCallback } from "react";

interface ReviewIssue {
  line?: number;
  severity: "error" | "warning" | "info";
  message: string;
  suggestion?: string;
}

interface ReviewResult {
  score: number;
  issues: ReviewIssue[];
  summary: string;
  improvements: string[];
}

export function useCodeReview() {
  const [isReviewing, setIsReviewing] = useState(false);
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reviewCode = useCallback(async (code: string, language?: string) => {
    setIsReviewing(true);
    setError(null);

    try {
      const response = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setResult(data);
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsReviewing(false);
    }
  }, []);

  const clearReview = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { isReviewing, result, error, reviewCode, clearReview };
}
