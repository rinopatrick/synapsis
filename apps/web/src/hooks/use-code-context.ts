"use client";

import { useIDEStore } from "@/hooks/use-ide-store";

export function useCodeContext() {
  const { openFiles, activeFile } = useIDEStore();

  const getCurrentFileContent = (): string | null => {
    if (!activeFile) return null;
    const file = openFiles.find((f) => f.id === activeFile);
    return file?.content || null;
  };

  const getCurrentFileName = (): string | null => {
    if (!activeFile) return null;
    const file = openFiles.find((f) => f.id === activeFile);
    return file?.name || null;
  };

  const getCurrentLanguage = (): string | null => {
    if (!activeFile) return null;
    const file = openFiles.find((f) => f.id === activeFile);
    return file?.language || null;
  };

  const getAllFilesContext = (): string => {
    return openFiles
      .map((f) => `// File: ${f.path}\n// Language: ${f.language}\n${f.content}`)
      .join("\n\n---\n\n");
  };

  const getSelectedCodeContext = (selectedText: string): string => {
    const fileName = getCurrentFileName();
    const language = getCurrentLanguage();

    return `Current file: ${fileName} (${language})\n\nSelected code:\n\`\`\`${language}\n${selectedText}\n\`\`\``;
  };

  const buildContextPrompt = (userMessage: string): string => {
    const currentContent = getCurrentFileContent();
    const fileName = getCurrentFileName();
    const language = getCurrentLanguage();

    let context = "";

    if (currentContent) {
      context += `\n\n## Current File Context\n`;
      context += `File: ${fileName}\n`;
      context += `Language: ${language}\n`;
      context += `\`\`\`${language}\n${currentContent}\n\`\`\`\n`;
    }

    if (openFiles.length > 1) {
      context += `\n## Open Files\n`;
      openFiles.forEach((f) => {
        if (f.id !== activeFile) {
          context += `- ${f.name} (${f.language})\n`;
        }
      });
    }

    return context;
  };

  return {
    getCurrentFileContent,
    getCurrentFileName,
    getCurrentLanguage,
    getAllFilesContext,
    getSelectedCodeContext,
    buildContextPrompt,
  };
}
