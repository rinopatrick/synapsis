import { useState, useCallback } from "react";

interface GenerationState {
  isGenerating: boolean;
  generatedCode: string | null;
  error: string | null;
}

export function useCodeGeneration() {
  const [state, setState] = useState<GenerationState>({
    isGenerating: false,
    generatedCode: null,
    error: null,
  });

  const generateCode = useCallback(async (description: string, language?: string, context?: string) => {
    setState({ isGenerating: true, generatedCode: null, error: null });

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, language, context }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setState({ isGenerating: false, generatedCode: data.code, error: null });
      return data.code;
    } catch (error: any) {
      setState({ isGenerating: false, generatedCode: null, error: error.message });
      return null;
    }
  }, []);

  const clearGenerated = useCallback(() => {
    setState({ isGenerating: false, generatedCode: null, error: null });
  }, []);

  return { ...state, generateCode, clearGenerated };
}
