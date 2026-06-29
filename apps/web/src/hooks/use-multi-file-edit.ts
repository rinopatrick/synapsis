import { useState, useCallback } from "react";

export interface FileChange {
  path: string;
  action: "create" | "modify" | "delete";
  content?: string;
  diff?: string;
}

interface MultiFileEditState {
  changes: FileChange[];
  isGenerating: boolean;
  isApplying: boolean;
  error: string | null;
}

export function useMultiFileEdit() {
  const [state, setState] = useState<MultiFileEditState>({
    changes: [],
    isGenerating: false,
    isApplying: false,
    error: null,
  });

  const generateChanges = useCallback(
    async (
      instruction: string,
      files: string[],
      options?: { context?: string; provider?: string; apiKey?: string; model?: string }
    ) => {
      setState((prev) => ({ ...prev, isGenerating: true, error: null }));

      try {
        const response = await fetch("/api/multi-edit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            instruction,
            files,
            context: options?.context,
            provider: options?.provider || "ollama",
            apiKey: options?.apiKey,
            model: options?.model,
          }),
        });

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        setState((prev) => ({
          ...prev,
          changes: data.changes || [],
          isGenerating: false,
        }));
      } catch (error: any) {
        setState((prev) => ({
          ...prev,
          isGenerating: false,
          error: error.message,
        }));
      }
    },
    []
  );

  const applyChanges = useCallback(async () => {
    setState((prev) => ({ ...prev, isApplying: true, error: null }));

    try {
      const response = await fetch("/api/multi-edit", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ changes: state.changes }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setState((prev) => ({
        ...prev,
        changes: [],
        isApplying: false,
      }));

      return data.applied as number;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isApplying: false,
        error: error.message,
      }));
      return 0;
    }
  }, [state.changes]);

  const clearChanges = useCallback(() => {
    setState({ changes: [], isGenerating: false, isApplying: false, error: null });
  }, []);

  return {
    ...state,
    generateChanges,
    applyChanges,
    clearChanges,
  };
}
