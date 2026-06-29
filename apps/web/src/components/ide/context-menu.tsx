"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useIDEStore } from "@/hooks/use-ide-store";

interface MenuItem {
  id: string;
  label: string;
  shortcut?: string;
  icon?: string;
  action: () => void;
  divider?: boolean;
  disabled?: boolean;
}

interface ContextMenuProps {
  x: number;
  y: number;
  items: MenuItem[];
  onClose: () => void;
}

export function ContextMenu({ x, y, items, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  // Adjust position to stay in viewport
  useEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      if (rect.right > window.innerWidth) {
        menuRef.current.style.left = `${x - rect.width}px`;
      }
      if (rect.bottom > window.innerHeight) {
        menuRef.current.style.top = `${y - rect.height}px`;
      }
    }
  }, [x, y]);

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-[#252526] border border-[#3c3c3c] rounded-lg shadow-xl py-1 min-w-[200px] animate-in fade-in zoom-in-95"
      style={{ left: `${x}px`, top: `${y}px` }}
    >
      {items.map((item) => (
        <div key={item.id}>
          {item.divider && <div className="border-t border-[#3c3c3c] my-1" />}
          <button
            className={cn(
              "w-full flex items-center justify-between px-3 py-1.5 text-sm text-gray-200 hover:bg-[#094771] transition-colors",
              item.disabled && "opacity-50 cursor-not-allowed"
            )}
            onClick={() => {
              if (!item.disabled) {
                item.action();
                onClose();
              }
            }}
            disabled={item.disabled}
          >
            <div className="flex items-center gap-2">
              {item.icon && <span>{item.icon}</span>}
              <span>{item.label}</span>
            </div>
            {item.shortcut && (
              <span className="text-xs text-gray-500 ml-4">{item.shortcut}</span>
            )}
          </button>
        </div>
      ))}
    </div>
  );
}

// Hook for context menu
export function useContextMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setPosition({ x: e.clientX, y: e.clientY });
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  return { isOpen, position, handleContextMenu, close };
}

// Editor Context Menu
export function EditorContextMenu({ x, y, onClose }: { x: number; y: number; onClose: () => void }) {
  const store = useIDEStore();

  const items: MenuItem[] = [
    { id: "cut", label: "Cut", shortcut: "Ctrl+X", icon: "✂️", action: () => store.addNotification("Cut", "info") },
    { id: "copy", label: "Copy", shortcut: "Ctrl+C", icon: "📋", action: () => store.addNotification("Copied", "info") },
    { id: "paste", label: "Paste", shortcut: "Ctrl+V", icon: "📌", action: () => store.addNotification("Pasted", "info") },
    { id: "divider1", label: "", action: () => {}, divider: true },
    { id: "find", label: "Find", shortcut: "Ctrl+F", icon: "🔍", action: () => store.addNotification("Find opened", "info") },
    { id: "replace", label: "Replace", shortcut: "Ctrl+H", icon: "🔄", action: () => store.addNotification("Replace opened", "info") },
    { id: "divider2", label: "", action: () => {}, divider: true },
    { id: "format", label: "Format Document", shortcut: "Shift+Alt+F", icon: "✨", action: () => store.addNotification("Formatted", "success") },
    { id: "divider3", label: "", action: () => {}, divider: true },
    { id: "explain", label: "Explain with AI", icon: "🧠", action: () => { store.setActiveSidebar("chat"); store.addNotification("Ask AI to explain", "info"); } },
    { id: "review", label: "Review with AI", icon: "📝", action: () => { store.setActiveSidebar("chat"); store.addNotification("Ask AI to review", "info"); } },
    { id: "divider4", label: "", action: () => {}, divider: true },
    { id: "command", label: "Command Palette...", shortcut: "Ctrl+Shift+P", icon: "⚡", action: () => store.toggleCommandPalette() },
  ];

  return <ContextMenu x={x} y={y} items={items} onClose={onClose} />;
}

// File Explorer Context Menu
export function FileContextMenu({ x, y, fileName, onClose }: { x: number; y: number; fileName: string; onClose: () => void }) {
  const store = useIDEStore();

  const items: MenuItem[] = [
    { id: "open", label: "Open", icon: "📂", action: () => { store.setShowWelcome(false); store.addNotification(`Opened: ${fileName}`, "success"); } },
    { id: "divider1", label: "", action: () => {}, divider: true },
    { id: "cut", label: "Cut", shortcut: "Ctrl+X", icon: "✂️", action: () => store.addNotification("Cut", "info") },
    { id: "copy", label: "Copy", shortcut: "Ctrl+C", icon: "📋", action: () => store.addNotification("Copied", "info") },
    { id: "paste", label: "Paste", shortcut: "Ctrl+V", icon: "📌", action: () => store.addNotification("Pasted", "info") },
    { id: "divider2", label: "", action: () => {}, divider: true },
    { id: "rename", label: "Rename", shortcut: "F2", icon: "✏️", action: () => store.addNotification("Rename mode", "info") },
    { id: "delete", label: "Delete", shortcut: "Delete", icon: "🗑️", action: () => store.addNotification(`Deleted: ${fileName}`, "warning") },
    { id: "divider3", label: "", action: () => {}, divider: true },
    { id: "copyPath", label: "Copy Path", shortcut: "Ctrl+Shift+C", icon: "📁", action: () => { navigator.clipboard.writeText(fileName); store.addNotification("Path copied", "success"); } },
    { id: "copyRelative", label: "Copy Relative Path", icon: "📄", action: () => { navigator.clipboard.writeText(fileName); store.addNotification("Relative path copied", "success"); } },
  ];

  return <ContextMenu x={x} y={y} items={items} onClose={onClose} />;
}

// Terminal Context Menu
export function TerminalContextMenu({ x, y, onClose }: { x: number; y: number; onClose: () => void }) {
  const store = useIDEStore();

  const items: MenuItem[] = [
    { id: "copy", label: "Copy", shortcut: "Ctrl+C", icon: "📋", action: () => store.addNotification("Copied", "info") },
    { id: "paste", label: "Paste", shortcut: "Ctrl+V", icon: "📌", action: () => store.addNotification("Pasted", "info") },
    { id: "divider1", label: "", action: () => {}, divider: true },
    { id: "clear", label: "Clear Terminal", icon: "🧹", action: () => store.clearTerminal() },
    { id: "divider2", label: "", action: () => {}, divider: true },
    { id: "newTerminal", label: "New Terminal", icon: "➕", action: () => store.addNotification("New terminal", "info") },
    { id: "splitTerminal", label: "Split Terminal", icon: "Split", action: () => store.addNotification("Split terminal", "info") },
  ];

  return <ContextMenu x={x} y={y} items={items} onClose={onClose} />;
}
