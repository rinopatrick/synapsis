"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface OutputLine {
  timestamp: string;
  source: string;
  message: string;
  level: "info" | "warn" | "error" | "debug";
}

interface OutputPanelProps {
  lines?: OutputLine[];
  source?: string;
}

const defaultLines: OutputLine[] = [
  { timestamp: "10:23:45", source: "synapsis", message: "Starting development server...", level: "info" },
  { timestamp: "10:23:46", source: "next.js", message: "  ▲ Next.js 14.2.35", level: "info" },
  { timestamp: "10:23:46", source: "next.js", message: "  - Local:        http://localhost:3000", level: "info" },
  { timestamp: "10:23:47", source: "next.js", message: "  - Environments: .env.local", level: "info" },
  { timestamp: "10:23:48", source: "next.js", message: "  ✓ Starting...", level: "info" },
  { timestamp: "10:23:50", source: "next.js", message: "  ✓ Ready in 2.1s", level: "info" },
  { timestamp: "10:24:01", source: "synapsis", message: "AI Provider: Ollama (localhost:11434)", level: "info" },
  { timestamp: "10:24:02", source: "synapsis", message: "Learning Mode: ON", level: "info" },
  { timestamp: "10:24:02", source: "synapsis", message: "User Level: Beginner", level: "info" },
];

export function OutputPanel({ lines = defaultLines, source = "synapsis" }: OutputPanelProps) {
  const [selectedSource, setSelectedSource] = useState(source);
  const [autoScroll, setAutoScroll] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [lines, autoScroll]);

  const sources = Array.from(new Set(lines.map((l) => l.source)));

  const getLevelColor = (level: string) => {
    switch (level) {
      case "error": return "text-red-400";
      case "warn": return "text-yellow-400";
      case "info": return "text-gray-300";
      case "debug": return "text-gray-500";
      default: return "";
    }
  };

  const filteredLines = selectedSource === "all"
    ? lines
    : lines.filter((l) => l.source === selectedSource);

  return (
    <div className="h-full bg-[#1e1e1e] flex flex-col">
      {/* Header */}
      <div className="bg-[#252526] px-4 py-1 text-xs text-gray-400 flex items-center justify-between border-b border-[#3c3c3c]">
        <div className="flex items-center gap-2">
          <span className="font-medium">Output</span>
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="bg-[#3c3c3c] text-gray-300 rounded px-2 py-0.5 text-xs outline-none"
          >
            <option value="all">All</option>
            {sources.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            className={cn("hover:text-white", autoScroll && "text-blue-400")}
            onClick={() => setAutoScroll(!autoScroll)}
          >
            Auto Scroll
          </button>
          <button className="hover:text-white">Clear</button>
        </div>
      </div>

      {/* Output lines */}
      <div className="flex-1 overflow-auto p-2 font-mono text-xs">
        {filteredLines.map((line, index) => (
          <div key={index} className="flex items-start gap-2 py-0.5">
            <span className="text-gray-600 w-16 shrink-0">{line.timestamp}</span>
            <span className="text-gray-500 w-20 shrink-0">[{line.source}]</span>
            <span className={getLevelColor(line.level)}>{line.message}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
