"use client";

import { useChat } from "ai/react";
import { useAppStore } from "./use-app-store";

export function useAIChat() {
  const { aiConfig } = useAppStore();

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
