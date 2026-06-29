"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useIDEStore } from "@/hooks/use-ide-store";

interface Command {
  id: string;
  label: string;
  category: string;
  shortcut?: string;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const store = useIDEStore();

  const commands: Command[] = [
    // File
    { id: "file.new", label: "New File", category: "File", shortcut: "Ctrl+N", action: () => { store.addNotification("New file created", "success"); onClose(); } },
    { id: "file.save", label: "Save", category: "File", shortcut: "Ctrl+S", action: () => { store.addNotification("File saved", "success"); onClose(); } },
    { id: "file.saveAll", label: "Save All", category: "File", shortcut: "Ctrl+Shift+S", action: () => { store.addNotification("All files saved", "success"); onClose(); } },
    
    // View
    { id: "view.explorer", label: "Show Explorer", category: "View", shortcut: "Ctrl+Shift+E", action: () => { store.setActiveSidebar("explorer"); onClose(); } },
    { id: "view.search", label: "Show Search", category: "View", shortcut: "Ctrl+Shift+F", action: () => { store.setActiveSidebar("search"); onClose(); } },
    { id: "view.git", label: "Show Source Control", category: "View", shortcut: "Ctrl+Shift+G", action: () => { store.setActiveSidebar("git"); onClose(); } },
    { id: "view.chat", label: "Show AI Chat", category: "View", action: () => { store.setActiveSidebar("chat"); onClose(); } },
    { id: "view.settings", label: "Show Settings", category: "View", shortcut: "Ctrl+,", action: () => { store.setActiveSidebar("settings"); onClose(); } },
    { id: "view.terminal", label: "Toggle Terminal", category: "View", shortcut: "Ctrl+`", action: () => { store.setActiveBottomPanel("terminal"); onClose(); } },
    { id: "view.problems", label: "Show Problems", category: "View", shortcut: "Ctrl+Shift+M", action: () => { store.setActiveBottomPanel("problems"); onClose(); } },
    { id: "view.output", label: "Show Output", category: "View", shortcut: "Ctrl+Shift+U", action: () => { store.setActiveBottomPanel("output"); onClose(); } },
    { id: "view.welcome", label: "Show Welcome Page", category: "View", action: () => { store.setShowWelcome(true); onClose(); } },
    { id: "view.toggleChat", label: "Toggle AI Chat Panel", category: "View", action: () => { store.toggleChat(); onClose(); } },
    { id: "view.toggleSidebar", label: "Toggle Sidebar", category: "View", shortcut: "Ctrl+B", action: () => { store.toggleSidebar(); onClose(); } },
    
    // AI
    { id: "ai.explain", label: "Explain Code", category: "AI", action: () => { store.setActiveSidebar("chat"); store.addNotification("Ask AI to explain code", "info"); onClose(); } },
    { id: "ai.hint", label: "Get Hint", category: "AI", action: () => { store.setActiveSidebar("chat"); store.addNotification("Ask AI for a hint", "info"); onClose(); } },
    { id: "ai.review", label: "Review Code", category: "AI", action: () => { store.setActiveSidebar("chat"); store.addNotification("Ask AI to review code", "info"); onClose(); } },
    { id: "ai.debug", label: "Debug Help", category: "AI", action: () => { store.setActiveSidebar("chat"); store.addNotification("Ask AI for debug help", "info"); onClose(); } },
    { id: "ai.learning", label: "Toggle Learning Mode", category: "AI", action: () => { 
      store.setLearningMode(store.learningMode === "learning" ? "builder" : "learning"); 
      store.addNotification(`Mode: ${store.learningMode === "learning" ? "Builder" : "Learning"}`, "info");
      onClose(); 
    }},
    { id: "ai.level", label: "Change User Level", category: "AI", action: () => { 
      const levels: ("beginner" | "intermediate" | "advanced")[] = ["beginner", "intermediate", "advanced"];
      const currentIdx = levels.indexOf(store.userLevel);
      const nextLevel = levels[(currentIdx + 1) % levels.length];
      store.setUserLevel(nextLevel);
      store.addNotification(`Level: ${nextLevel}`, "info");
      onClose(); 
    }},
    
    // Terminal
    { id: "terminal.run", label: "Run Project", category: "Terminal", shortcut: "Ctrl+Shift+N", action: () => { 
      store.setActiveBottomPanel("terminal");
      store.addTerminalLine("info", "Starting development server...");
      store.addTerminalLine("output", "  ▲ Next.js 14.2.35");
      store.addTerminalLine("output", "  - Local: http://localhost:3000");
      store.addTerminalLine("info", "✓ Ready in 2.1s");
      onClose(); 
    }},
    { id: "terminal.build", label: "Build Project", category: "Terminal", shortcut: "Ctrl+Shift+B", action: () => { 
      store.setActiveBottomPanel("terminal");
      store.addTerminalLine("info", "Building project...");
      store.addTerminalLine("output", "  Creating optimized production build...");
      store.addTerminalLine("info", "✓ Build completed");
      onClose(); 
    }},
    { id: "terminal.test", label: "Run Tests", category: "Terminal", shortcut: "Ctrl+Shift+T", action: () => { 
      store.setActiveBottomPanel("terminal");
      store.addTerminalLine("info", "Running tests...");
      store.addTerminalLine("output", "  PASS  src/app/page.test.tsx");
      store.addTerminalLine("output", "  PASS  src/components/Button.test.tsx");
      store.addTerminalLine("info", "✓ All tests passed!");
      onClose(); 
    }},
    { id: "terminal.clear", label: "Clear Terminal", category: "Terminal", action: () => { store.clearTerminal(); onClose(); } },
    
    // Help
    { id: "help.shortcuts", label: "Keyboard Shortcuts", category: "Help", shortcut: "Ctrl+K Ctrl+S", action: () => { store.addNotification("Keyboard shortcuts: Ctrl+Shift+P for commands", "info"); onClose(); } },
    { id: "help.docs", label: "Documentation", category: "Help", action: () => { store.addNotification("Opening documentation...", "info"); onClose(); } },
  ];

  const filteredCommands = query
    ? commands.filter(
        (cmd) =>
          cmd.label.toLowerCase().includes(query.toLowerCase()) ||
          cmd.category.toLowerCase().includes(query.toLowerCase())
      )
    : commands;

  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, Command[]>);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, filteredCommands.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        filteredCommands[selectedIndex]?.action();
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-[600px] bg-[#252526] rounded-lg shadow-2xl border border-[#3c3c3c] overflow-hidden">
        <div className="p-3 border-b border-[#3c3c3c]">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            placeholder="Type a command..."
            className="w-full bg-[#3c3c3c] text-white rounded px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="max-h-[400px] overflow-auto">
          {Object.entries(groupedCommands).map(([category, cmds]) => (
            <div key={category}>
              <div className="px-3 py-1.5 text-xs text-gray-400 uppercase tracking-wider bg-[#1e1e1e]">{category}</div>
              {cmds.map((cmd) => {
                const index = filteredCommands.indexOf(cmd);
                return (
                  <div
                    key={cmd.id}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 cursor-pointer",
                      selectedIndex === index ? "bg-[#094771]" : "hover:bg-[#2a2d2e]"
                    )}
                    onClick={() => cmd.action()}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <span className="text-sm text-gray-200">{cmd.label}</span>
                    {cmd.shortcut && (
                      <span className="text-xs text-gray-500 bg-[#3c3c3c] px-2 py-0.5 rounded">{cmd.shortcut}</span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
          {filteredCommands.length === 0 && (
            <div className="px-3 py-8 text-center text-gray-500 text-sm">No commands found</div>
          )}
        </div>
        <div className="px-3 py-2 border-t border-[#3c3c3c] text-xs text-gray-500 flex items-center gap-4">
          <span>↑↓ Navigate</span>
          <span>↵ Select</span>
          <span>Esc Close</span>
        </div>
      </div>
    </div>
  );
}
