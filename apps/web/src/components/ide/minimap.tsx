"use client";

import { cn } from "@/lib/utils";

interface MinimapProps {
  content: string;
  currentLine: number;
  totalLines: number;
  onLineClick: (line: number) => void;
}

export function Minimap({ content, currentLine, totalLines, onLineClick }: MinimapProps) {
  const lines = content.split("\n");
  const visibleLines = Math.min(lines.length, 50);
  const lineHeight = 3;
  const viewportHeight = 100;

  // Calculate viewport position
  const viewportTop = (currentLine / totalLines) * (visibleLines * lineHeight);

  return (
    <div className="w-[60px] bg-[#1e1e1e] border-l border-[#3c3c3c] overflow-hidden relative cursor-pointer">
      {/* Minimap lines */}
      <div className="p-1">
        {lines.slice(0, visibleLines).map((line, i) => (
          <div
            key={i}
            className="h-[3px] mb-[1px] rounded-sm opacity-50 hover:opacity-100 transition-opacity"
            style={{
              width: `${Math.min(line.length * 0.5, 50)}px`,
              backgroundColor: line.trim().startsWith("//") ? "#6A9955" : 
                             line.trim().startsWith("import") || line.trim().startsWith("export") ? "#C586C0" :
                             line.trim().startsWith("const") || line.trim().startsWith("let") ? "#9CDCFE" : "#d4d4d4",
            }}
            onClick={() => onLineClick(i)}
          />
        ))}
      </div>

      {/* Viewport indicator */}
      <div
        className="absolute left-0 right-0 bg-white/10 border border-white/20 rounded-sm transition-all"
        style={{
          top: `${viewportTop}px`,
          height: `${viewportHeight}px`,
        }}
      />
    </div>
  );
}
