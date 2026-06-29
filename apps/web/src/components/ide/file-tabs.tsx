"use client";

import { cn } from "@/lib/utils";
import { useIDEStore } from "@/hooks/use-ide-store";

interface FileTab {
  id: string;
  name: string;
  path: string;
  modified: boolean;
  language: string;
}

const fileIcons: Record<string, string> = {
  tsx: "⚛️",
  ts: "📘",
  js: "📒",
  jsx: "⚛️",
  json: "📋",
  css: "🎨",
  html: "🌐",
  md: "📝",
  py: "🐍",
};

function getFileIcon(name: string): string {
  const ext = name.split(".").pop() || "";
  return fileIcons[ext] || "📄";
}

export function FileTabs() {
  const { activeFile, setActiveFile, openFiles, closeFile, addNotification } = useIDEStore();

  if (openFiles.length === 0) return null;

  return (
    <div className="flex bg-[#252526] border-b border-[#3c3c3c] overflow-x-auto">
      {openFiles.map((file) => (
        <div
          key={file.id}
          className={cn(
            "flex items-center gap-1.5 px-3 py-2 text-sm cursor-pointer border-r border-[#3c3c3c] min-w-0 group",
            activeFile === file.id
              ? "bg-[#1e1e1e] text-white"
              : "bg-[#2d2d2d] text-gray-400 hover:text-gray-200"
          )}
          onClick={() => setActiveFile(file.id)}
        >
          <span>{getFileIcon(file.name)}</span>
          <span className="truncate">{file.name}</span>
          {file.modified && (
            <span className="w-2 h-2 rounded-full bg-orange-400 ml-1" />
          )}
          <button
            className="ml-1 opacity-0 group-hover:opacity-100 hover:text-white text-xs px-1"
            onClick={(e) => {
              e.stopPropagation();
              closeFile(file.id);
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
