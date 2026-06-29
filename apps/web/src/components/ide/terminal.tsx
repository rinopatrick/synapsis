"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useIDEStore } from "@/hooks/use-ide-store";

export function Terminal() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { terminalLines, addTerminalLine, clearTerminal, addNotification } = useIDEStore();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalLines]);

  const processCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    addTerminalLine("input", `$ ${cmd}`);

    if (trimmed === "help") {
      addTerminalLine("info", "Available commands:");
      addTerminalLine("output", "  help              Show this help");
      addTerminalLine("output", "  clear             Clear terminal");
      addTerminalLine("output", "  run               Run dev server");
      addTerminalLine("output", "  build             Build project");
      addTerminalLine("output", "  test              Run tests");
      addTerminalLine("output", "  install <pkg>     Install package");
      addTerminalLine("output", "  explain <topic>   Ask AI to explain");
      addTerminalLine("output", "  hint              Get a hint");
      addTerminalLine("output", "  level             Show/change level");
      addTerminalLine("output", "  mode              Show/change mode");
    } else if (trimmed === "clear") {
      clearTerminal();
      return;
    } else if (trimmed === "run" || trimmed === "npm run dev") {
      addTerminalLine("info", "Starting development server...");
      addTerminalLine("output", "  ▲ Next.js 14.2.35");
      addTerminalLine("output", "  - Local:        http://localhost:3000");
      addTerminalLine("output", "");
      addTerminalLine("info", "✓ Ready in 2.1s");
      addNotification("Dev server started", "success");
    } else if (trimmed === "build" || trimmed === "npm run build") {
      addTerminalLine("info", "Building project...");
      addTerminalLine("output", "  Creating optimized production build...");
      addTerminalLine("output", "  Compiled successfully!");
      addTerminalLine("info", "✓ Build completed");
      addNotification("Build completed", "success");
    } else if (trimmed === "test" || trimmed === "npm test") {
      addTerminalLine("info", "Running tests...");
      addTerminalLine("output", "  PASS  src/app/page.test.tsx");
      addTerminalLine("output", "  PASS  src/components/Button.test.tsx");
      addTerminalLine("info", "✓ All tests passed!");
      addNotification("All tests passed", "success");
    } else if (trimmed.startsWith("install ")) {
      const pkg = trimmed.replace("install ", "");
      addTerminalLine("info", `Installing ${pkg}...`);
      addTerminalLine("output", "  added 1 package in 3.2s");
      addTerminalLine("info", `✓ ${pkg} installed`);
      addNotification(`${pkg} installed`, "success");
    } else if (trimmed.startsWith("explain ")) {
      const topic = trimmed.replace("explain ", "");
      addTerminalLine("info", `🤔 Thinking about "${topic}"...`);
      addTerminalLine("output", "");
      addTerminalLine("output", `  "${topic}" is a concept that...`);
      addTerminalLine("output", "  [AI would explain this in the chat panel]");
      addTerminalLine("info", "💡 Check the AI Chat panel for detailed explanation");
    } else if (trimmed === "hint") {
      addTerminalLine("info", "💡 Hint: Try breaking down the problem into smaller steps.");
      addTerminalLine("info", "   Ask the AI in the chat panel for more specific hints!");
    } else if (trimmed === "level") {
      addTerminalLine("info", "Current level: Beginner");
      addTerminalLine("info", "Use Settings panel or Command Palette to change");
    } else if (trimmed === "mode") {
      addTerminalLine("info", "Current mode: Learning");
      addTerminalLine("info", "Use Settings panel or Command Palette to change");
    } else if (trimmed) {
      addTerminalLine("error", `Command not found: ${trimmed}`);
      addTerminalLine("output", "Type 'help' for available commands");
    }

    addTerminalLine("output", "");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      processCommand(input);
      setHistory([...history, input]);
      setHistoryIndex(-1);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
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

  return (
    <div className="h-full bg-[#1e1e1e] flex flex-col">
      <div className="bg-[#252526] px-4 py-1 text-xs text-gray-400 flex items-center justify-between border-b border-[#3c3c3c]">
        <div className="flex items-center gap-2">
          <span>Terminal</span>
          <span className="text-gray-600">|</span>
          <span>bash</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="hover:text-white" onClick={() => addTerminalLine("info", "New terminal opened")}>+</button>
          <button className="hover:text-white" onClick={clearTerminal}>trash</button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-2 font-mono text-sm">
        {terminalLines.map((line, i) => (
          <div
            key={i}
            className={cn(
              "leading-5",
              line.type === "input" && "text-white",
              line.type === "output" && "text-gray-300",
              line.type === "error" && "text-red-400",
              line.type === "info" && "text-blue-400"
            )}
          >
            {line.content}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="border-t border-[#3c3c3c] p-2 flex items-center gap-2">
        <span className="text-green-400 font-mono text-sm">$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent text-white font-mono text-sm outline-none"
          placeholder="Type a command..."
        />
      </div>
    </div>
  );
}
