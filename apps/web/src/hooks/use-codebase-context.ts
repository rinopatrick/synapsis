"use client";

import { useState, useCallback, useEffect } from "react";

export interface CodebaseFile {
  path: string;
  name: string;
  extension: string;
  size: number;
  content?: string;
  summary?: string;
}

interface CodebaseContext {
  files: CodebaseFile[];
  totalFiles: number;
  totalSize: number;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  getFileContent: (path: string) => Promise<string>;
  searchFiles: (query: string) => CodebaseFile[];
  getContextSummary: () => string;
}

export function useCodebaseContext(): CodebaseContext {
  const [files, setFiles] = useState<CodebaseFile[]>([]);
  const [totalFiles, setTotalFiles] = useState(0);
  const [totalSize, setTotalSize] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/codebase");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setFiles(data.files || []);
      setTotalFiles(data.totalFiles || 0);
      setTotalSize(data.totalSize || 0);
    } catch {
      setError("Failed to index codebase");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getFileContent = useCallback(async (path: string) => {
    const response = await fetch(`/api/codebase?file=${encodeURIComponent(path)}`);
    if (!response.ok) return "";
    const data = await response.json();
    return data.content || "";
  }, []);

  const searchFiles = useCallback(
    (query: string) => {
      const lowerQuery = query.toLowerCase();
      return files.filter(
        (f) =>
          f.path.toLowerCase().includes(lowerQuery) ||
          f.name.toLowerCase().includes(lowerQuery) ||
          f.summary?.toLowerCase().includes(lowerQuery)
      );
    },
    [files]
  );

  const getContextSummary = useCallback(() => {
    if (files.length === 0) return "No codebase indexed.";

    const byExt = files.reduce<Record<string, number>>((acc, f) => {
      acc[f.extension] = (acc[f.extension] || 0) + 1;
      return acc;
    }, {});

    const extSummary = Object.entries(byExt)
      .map(([ext, count]) => `${ext}: ${count}`)
      .join(", ");

    const fileTree = files
      .slice(0, 100)
      .map((f) => {
        const summaryLine = f.summary ? ` — ${f.summary.split("\n")[0]}` : "";
        return `- ${f.path}${summaryLine}`;
      })
      .join("\n");

    return `## Codebase Overview\nTotal files: ${totalFiles} | Total size: ${Math.round(totalSize / 1024)}KB\nFile types: ${extSummary}\n\n## File Structure\n${fileTree}${files.length > 100 ? "\n... (truncated)" : ""}`;
  }, [files, totalFiles, totalSize]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    files,
    totalFiles,
    totalSize,
    isLoading,
    error,
    refresh,
    getFileContent,
    searchFiles,
    getContextSummary,
  };
}
