import { useState, useCallback, useRef } from "react";
import { useDebounce } from "./use-memoized";

interface AutocompleteState {
  suggestion: string;
  isLoading: boolean;
  position: { line: number; column: number } | null;
}

export function useAutocomplete() {
  const [state, setState] = useState<AutocompleteState>({
    suggestion: "",
    isLoading: false,
    position: null,
  });
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchSuggestion = useCallback(
    async (
      prefix: string,
      suffix: string,
      language: string,
      fileName: string,
      position: { line: number; column: number }
    ) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      setState((prev) => ({ ...prev, isLoading: true, position }));

      try {
        const response = await fetch("/api/autocomplete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prefix, suffix, language, fileName }),
          signal: abortControllerRef.current.signal,
        });

        const data = await response.json();
        setState({
          suggestion: data.suggestion || "",
          isLoading: false,
          position,
        });
      } catch (error: any) {
        if (error.name !== "AbortError") {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      }
    },
    []
  );

  const debouncedFetch = useDebounce(fetchSuggestion, 300);

  const clearSuggestion = useCallback(() => {
    setState({ suggestion: "", isLoading: false, position: null });
  }, []);

  const acceptSuggestion = useCallback(() => {
    setState((prev) => ({ ...prev, suggestion: "" }));
  }, []);

  return {
    ...state,
    fetchSuggestion: debouncedFetch,
    clearSuggestion,
    acceptSuggestion,
  };
}
