"use client";

import { useChat } from "ai/react";
import { useAppStore } from "./use-app-store";
import { useCodebaseContext } from "./use-codebase-context";

export function useAIChat() {
  const { aiConfig } = useAppStore();
  const { getContextSummary } = useCodebaseContext();

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    reload,
    stop,
  } = useChat({
    api: "/api/chat",
    body: {
      config: aiConfig,
      codebaseContext: getContextSummary(),
    },
    onError: (error) => {
      console.error("Chat error:", error);
    },
  });

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    reload,
    stop,
  };
}
