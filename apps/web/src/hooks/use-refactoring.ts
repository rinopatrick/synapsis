import { useState, useCallback } from "react";

interface RefactorChange {
  type: "improvement" | "fix" | "optimization";
  description: string;
  line?: number;
}

interface RefactorResult {
  refactoredCode: string;
  changes: RefactorChange[];
  explanation: string;
}

export function useRefactoring() {
  const [isRefactoring, setIsRefactoring] = useState(false);
  const [result, setResult] = useState<RefactorResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refactorCode = useCallback(async (
    code: string,
    language?: string,
    instruction?: string
  ) => {
    setIsRefactoring(true);
    setError(null);

    try {
      const response = await fetch("/api/refactor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language, instruction }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setResult(data);
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsRefactoring(false);
    }
  }, []);

  const clearResult = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { isRefactoring, result, error, refactorCode, clearResult };
}
