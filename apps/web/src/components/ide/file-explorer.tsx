"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useIDEStore } from "@/hooks/use-ide-store";

interface FileItem {
  name: string;
  type: "file" | "folder";
  children?: FileItem[];
  path: string;
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
  rs: "🦀",
  go: "🐹",
  default: "📄",
};

function getFileIcon(name: string): string {
  const ext = name.split(".").pop() || "";
  return fileIcons[ext] || fileIcons.default;
}

function FileTreeItem({
  item,
  depth = 0,
}: {
  item: FileItem;
  depth?: number;
}) {
  const [expanded, setExpanded] = useState(depth < 2);
  const isFolder = item.type === "folder";
  const { activeFile, openFiles, openFile } = useIDEStore();
  
  const isOpen = openFiles.some((f) => f.path === item.path);
  const isActive = openFiles.find((f) => f.id === activeFile)?.path === item.path;

  const handleClick = () => {
    if (isFolder) {
      setExpanded(!expanded);
    } else {
      // Check if file is already open
      const existingFile = openFiles.find((f) => f.path === item.path);
      if (existingFile) {
        useIDEStore.getState().setActiveFile(existingFile.id);
      } else {
        // Open new file
        const ext = item.name.split(".").pop() || "";
        const langMap: Record<string, string> = {
          ts: "typescript",
          tsx: "typescript",
          js: "javascript",
          jsx: "javascript",
          json: "json",
          css: "css",
          html: "html",
          md: "markdown",
        };
        
        openFile({
          id: item.path,
          name: item.name,
          path: item.path,
          modified: false,
          language: langMap[ext] || "plaintext",
          content: `// ${item.name}\n// This file is ready for you to code!\n\nconsole.log("Hello from ${item.name}");`,
        });
      }
    }
  };

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-1 py-0.5 px-2 cursor-pointer hover:bg-[#2a2d2e] text-sm",
          isActive && "bg-[#37373d]"
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={handleClick}
      >
        {isFolder ? (
          <span className="text-xs w-4">{expanded ? "▼" : "▶"}</span>
        ) : (
          <span className="w-4" />
        )}
        <span className="mr-1">
          {isFolder ? (expanded ? "📂" : "📁") : getFileIcon(item.name)}
        </span>
        <span className={cn("truncate", isActive ? "text-white" : isOpen ? "text-gray-200" : "text-gray-300")}>
          {item.name}
        </span>
        {isOpen && !isActive && (
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 ml-auto" />
        )}
      </div>
      {isFolder && expanded && item.children && (
        <div>
          {item.children.map((child, index) => (
            <FileTreeItem key={index} item={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

const demoFiles: FileItem[] = [
  {
    name: "src",
    type: "folder",
    path: "src",
    children: [
      {
        name: "app",
        type: "folder",
        path: "src/app",
        children: [
          { name: "layout.tsx", type: "file", path: "src/app/layout.tsx" },
          { name: "page.tsx", type: "file", path: "src/app/page.tsx" },
          { name: "globals.css", type: "file", path: "src/app/globals.css" },
        ],
      },
      {
        name: "components",
        type: "folder",
        path: "src/components",
        children: [
          { name: "Button.tsx", type: "file", path: "src/components/Button.tsx" },
          { name: "Card.tsx", type: "file", path: "src/components/Card.tsx" },
          { name: "Modal.tsx", type: "file", path: "src/components/Modal.tsx" },
        ],
      },
      {
        name: "lib",
        type: "folder",
        path: "src/lib",
        children: [
          { name: "utils.ts", type: "file", path: "src/lib/utils.ts" },
          { name: "api.ts", type: "file", path: "src/lib/api.ts" },
        ],
      },
      {
        name: "hooks",
        type: "folder",
        path: "src/hooks",
        children: [
          { name: "useAuth.ts", type: "file", path: "src/hooks/useAuth.ts" },
          { name: "useStore.ts", type: "file", path: "src/hooks/useStore.ts" },
        ],
      },
    ],
  },
  {
    name: "public",
    type: "folder",
    path: "public",
    children: [
      { name: "favicon.ico", type: "file", path: "public/favicon.ico" },
      { name: "logo.svg", type: "file", path: "public/logo.svg" },
    ],
  },
  { name: "package.json", type: "file", path: "package.json" },
  { name: "tsconfig.json", type: "file", path: "tsconfig.json" },
  { name: "README.md", type: "file", path: "README.md" },
  { name: ".gitignore", type: "file", path: ".gitignore" },
];

export function FileExplorer() {
  return (
    <div className="h-full bg-[#252526] flex flex-col">
      <div className="px-4 py-2 text-xs uppercase tracking-wider text-gray-400 font-medium">
        Explorer
      </div>
      <div className="flex-1 overflow-auto">
        {demoFiles.map((item, index) => (
          <FileTreeItem key={index} item={item} />
        ))}
      </div>
    </div>
  );
}
