"use client";

import { cn } from "@/lib/utils";
import { useIDEStore, type ActivityTab } from "@/hooks/use-ide-store";
import { Icon } from "./icons";

interface ActivityBarProps {
  activeTab: ActivityTab;
  onTabChange: (tab: ActivityTab) => void;
}

// VSCode standard + Synapsis innovations
const topTabs: { id: ActivityTab; icon: string; label: string; badge?: number }[] = [
  { id: "explorer", icon: "files", label: "Explorer" },
  { id: "search", icon: "search", label: "Search" },
  { id: "git", icon: "git", label: "Source Control" },
  { id: "debug", icon: "debug", label: "Run and Debug" },
  { id: "extensions", icon: "extensions", label: "Extensions" },
];

// Synapsis innovative features
const bottomTabs: { id: ActivityTab; icon: string; label: string }[] = [
  { id: "chat", icon: "ai", label: "Synapsis AI" },
  { id: "collab", icon: "people", label: "Live Share" },
  { id: "oauth", icon: "lock", label: "Accounts" },
  { id: "settings", icon: "settings", label: "Settings" },
];

export function ActivityBar({ activeTab, onTabChange }: ActivityBarProps) {
  const { showChat, toggleChat } = useIDEStore();

  return (
    <div className="w-12 bg-[#333333] flex flex-col items-center py-0 shrink-0">
      {/* Top tabs - VSCode standard */}
      <div className="flex flex-col items-center flex-1">
        {topTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "w-12 h-12 flex items-center justify-center transition-all relative group",
              activeTab === tab.id
                ? "text-white"
                : "text-[#858585] hover:text-white"
            )}
            title={tab.label}
          >
            <Icon name={tab.icon} size={24} />
            {activeTab === tab.id && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-6 bg-white rounded-r" />
            )}
            {tab.badge && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                {tab.badge}
              </span>
            )}
            <div className="absolute left-12 bg-[#1e1e1e] text-white text-xs px-3 py-1.5 rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 border border-[#3c3c3c]">
              {tab.label}
              <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-[#1e1e1e] border-l border-b border-[#3c3c3c] rotate-45" />
            </div>
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="w-8 h-px bg-[#3c3c3c] my-2" />

      {/* Bottom tabs - Synapsis innovations */}
      <div className="flex flex-col items-center">
        {bottomTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              if (tab.id === "chat") {
                toggleChat();
              } else {
                onTabChange(tab.id);
              }
            }}
            className={cn(
              "w-12 h-12 flex items-center justify-center transition-all relative group",
              activeTab === tab.id || (tab.id === "chat" && showChat)
                ? "text-white"
                : "text-[#858585] hover:text-white"
            )}
            title={tab.label}
          >
            <Icon name={tab.icon} size={24} />
            {(activeTab === tab.id || (tab.id === "chat" && showChat)) && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-6 bg-white rounded-r" />
            )}
            <div className="absolute left-12 bg-[#1e1e1e] text-white text-xs px-3 py-1.5 rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 border border-[#3c3c3c]">
              {tab.label}
              {tab.id === "chat" && <span className="ml-1 text-gray-400">(Ctrl+Shift+L)</span>}
              <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-[#1e1e1e] border-l border-b border-[#3c3c3c] rotate-45" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
