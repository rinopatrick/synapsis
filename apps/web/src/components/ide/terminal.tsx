"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface TerminalLine {
  id: string;
  type: "input" | "output" | "error";
  content: string;
  timestamp: Date;
}

export function Terminal() {
  const [input, setInput] = useState("");
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: "welcome",
      type: "output",
      content: "Welcome to Synapsis Terminal\nType commands to execute them.\n",
      timestamp: new Date(),
    },
  ]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isExecuting, setIsExecuting] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const executeCommand = useCallback(
    async (command: string) => {
      const trimmed = command.trim();
      if (!trimmed) return;

      // Handle clear locally
      if (trimmed.toLowerCase() === "clear") {
        setLines([]);
        return;
      }

      // Add input line
      const inputLine: TerminalLine = {
        id: `input-${Date.now()}`,
        type: "input",
        content: `$ ${trimmed}`,
        timestamp: new Date(),
      };
      setLines((prev) => [...prev, inputLine]);
      setHistory((prev) => [trimmed, ...prev]);
      setHistoryIndex(-1);
      setIsExecuting(true);

      try {
        const response = await fetch("/api/terminal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ command: trimmed }),
        });

        const data = await response.json();

        if (data.stdout) {
          const outputLine: TerminalLine = {
            id: `output-${Date.now()}`,
            type: "output",
            content: data.stdout.replace(/\n$/, ""),
            timestamp: new Date(),
          };
          setLines((prev) => [...prev, outputLine]);
        }

        if (data.stderr) {
          const errorLine: TerminalLine = {
            id: `error-${Date.now()}`,
            type: "error",
            content: data.stderr.replace(/\n$/, ""),
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
    },
    [],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executeCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex =
          historyIndex === -1
            ? history.length - 1
            : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= history.length) {
          setHistoryIndex(-1);
          setInput("");
        } else {
          setHistoryIndex(newIndex);
          setInput(history[newIndex]);
        }
      }
    }
  };

  const clearTerminal = () => {
    setLines([]);
  };

  return (
    <div className="h-full bg-[#1e1e1e] flex flex-col">
      <div className="bg-[#252526] px-4 py-1 text-xs text-gray-400 flex items-center justify-between border-b border-[#3c3c3c]">
        <div className="flex items-center gap-2">
          <span>Terminal</span>
          <span className="text-gray-600">|</span>
          <span>bash</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="hover:text-white"
            onClick={clearTerminal}
            title="Clear terminal"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-2 font-mono text-sm">
        {lines.map((line) => (
          <div
            key={line.id}
            className={cn(
              "leading-5 whitespace-pre-wrap",
              line.type === "input" && "text-white",
              line.type === "output" && "text-gray-300",
              line.type === "error" && "text-red-400",
            )}
          >
            {line.content}
          </div>
        ))}
        {isExecuting && (
          <div className="text-yellow-400 animate-pulse">Executing...</div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="border-t border-[#3c3c3c] p-2 flex items-center gap-2">
        <span className="text-green-400 font-mono text-sm">$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isExecuting}
          className="flex-1 bg-transparent text-white font-mono text-sm outline-none disabled:opacity-50"
          placeholder={
            isExecuting ? "Executing..." : "Type a command..."
          }
        />
      </div>
    </div>
  );
}
