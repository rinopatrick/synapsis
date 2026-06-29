import { useState, useCallback } from "react";

interface TerminalLine {
  id: string;
  type: "input" | "output" | "error";
  content: string;
  timestamp: Date;
}

export function useTerminal() {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isExecuting, setIsExecuting] = useState(false);

  const executeCommand = useCallback(async (command: string) => {
    const inputLine: TerminalLine = {
      id: `input-${Date.now()}`,
      type: "input",
      content: `$ ${command}`,
      timestamp: new Date(),
    };
    setLines((prev) => [...prev, inputLine]);
    setHistory((prev) => [command, ...prev]);
    setHistoryIndex(-1);
    setIsExecuting(true);

    try {
      const response = await fetch("/api/terminal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command }),
      });

      const data = await response.json();

      if (data.stdout) {
        const outputLine: TerminalLine = {
          id: `output-${Date.now()}`,
          type: "output",
          content: data.stdout,
          timestamp: new Date(),
        };
        setLines((prev) => [...prev, outputLine]);
      }

      if (data.stderr) {
        const errorLine: TerminalLine = {
          id: `error-${Date.now()}`,
          type: "error",
          content: data.stderr,
          timestamp: new Date(),
        };
        setLines((prev) => [...prev, errorLine]);
      }
    } catch (error) {
      const errorLine: TerminalLine = {
        id: `error-${Date.now()}`,
        type: "error",
        content: `Failed to execute command: ${error}`,
        timestamp: new Date(),
      };
      setLines((prev) => [...prev, errorLine]);
    } finally {
      setIsExecuting(false);
    }
  }, []);

  const clearTerminal = useCallback(() => {
    setLines([]);
  }, []);

  const navigateHistory = useCallback(
    (direction: "up" | "down") => {
      setHistoryIndex((prev) => {
        if (direction === "up") {
          return Math.min(prev + 1, history.length - 1);
        } else {
          return Math.max(prev - 1, -1);
        }
      });
      return history[historyIndex] || "";
    },
    [history, historyIndex],
  );

  return {
    lines,
    isExecuting,
    executeCommand,
    clearTerminal,
    navigateHistory,
  };
}
