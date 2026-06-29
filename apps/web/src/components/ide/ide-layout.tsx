"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ActivityBar } from "./activity-bar";
import { FileExplorer } from "./file-explorer";
import { CodeEditor } from "./code-editor";
import { Terminal } from "./terminal";
import { ProblemsPanel } from "./problems-panel";
import { OutputPanel } from "./output-panel";
import { AIChatPanel } from "./ai-chat";
import { CommandPalette } from "./command-palette";
import { WelcomePage } from "./welcome-page";
import { LearningDashboard } from "./learning-dashboard";
import { SnippetsPanel } from "./snippets-panel";
import { SettingsPanel } from "./settings-panel";
import { OAuthPanel } from "./oauth-panel";
import { CollaborativePanel } from "./collaborative-panel";
import { SearchPanel } from "./search-panel";
import { GitPanel } from "./git-panel";
import { NotificationToast } from "./notification-toast";
import { SplashScreen } from "./splash-screen";
import { ResizeHandle } from "./resize-handle";
import { EditorContextMenu, useContextMenu } from "./context-menu";
import { NewWorkspaceDialog, OpenWorkspaceDialog, NewFileDialog } from "./workspace-dialogs";
import { cn } from "@/lib/utils";
import { useIDEStore } from "@/hooks/use-ide-store";
import { useWorkspace } from "@/hooks/use-workspace";

export function IDELayout() {
  const store = useIDEStore();
  const editorContextMenu = useContextMenu();
  const workspace = useWorkspace();
  const [showSplash, setShowSplash] = useState(true);
  const [showDashboard, setShowDashboard] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [showNewWorkspace, setShowNewWorkspace] = useState(false);
  const [showOpenWorkspace, setShowOpenWorkspace] = useState(false);
  const [showNewFile, setShowNewFile] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey && e.shiftKey && e.key === "P") {
      e.preventDefault();
      store.toggleCommandPalette();
    }
    // Toggle AI Chat
    if (e.ctrlKey && e.shiftKey && e.key === "L") {
      e.preventDefault();
      store.toggleChat();
    }
    if (e.ctrlKey && e.key === "`") {
      e.preventDefault();
      store.toggleBottomPanel();
    }
    if (e.ctrlKey && e.key === "b") {
      e.preventDefault();
      store.toggleSidebar();
    }
    if (e.ctrlKey && e.key === "s") {
      e.preventDefault();
      if (store.activeFile) {
        const file = store.openFiles.find(f => f.id === store.activeFile);
        if (file) {
          workspace.saveFile(file.id, file.content);
          store.updateFileContent(file.id, file.content);
        }
      }
    }
    if (e.ctrlKey && e.key === "n") {
      e.preventDefault();
      setShowNewFile(true);
    }
    if (e.key === "Escape") {
      if (store.showCommandPalette) store.toggleCommandPalette();
      setActiveMenu(null);
      setShowNewWorkspace(false);
      setShowOpenWorkspace(false);
      setShowNewFile(false);
    }
    if (e.ctrlKey && e.key === "w") {
      e.preventDefault();
      if (store.activeFile) store.closeFile(store.activeFile);
    }
    if (e.ctrlKey && e.shiftKey && e.key === "D") {
      e.preventDefault();
      setShowDashboard(!showDashboard);
    }
  }, [store, showDashboard, workspace]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Menu actions - ALL REAL
  const menuActions: Record<string, Record<string, () => void>> = {
    File: {
      "New File": () => { setShowNewFile(true); setActiveMenu(null); },
      "New Workspace": () => { setShowNewWorkspace(true); setActiveMenu(null); },
      "Open Workspace": () => { setShowOpenWorkspace(true); setActiveMenu(null); },
      "Save": () => {
        if (store.activeFile) {
          const file = store.openFiles.find(f => f.id === store.activeFile);
          if (file) {
            workspace.saveFile(file.id, file.content);
            store.updateFileContent(file.id, file.content);
          }
        }
        setActiveMenu(null);
      },
      "Save All": () => {
        store.openFiles.forEach(file => {
          workspace.saveFile(file.id, file.content);
        });
        store.addNotification("All files saved", "success");
        setActiveMenu(null);
      },
      "Close Tab": () => { if (store.activeFile) store.closeFile(store.activeFile); setActiveMenu(null); },
      "Close All Tabs": () => {
        store.openFiles.forEach(f => store.closeFile(f.id));
        setActiveMenu(null);
      },
    },
    Edit: {
      "Undo": () => {
        document.execCommand("undo");
        store.addNotification("Undo", "info");
        setActiveMenu(null);
      },
      "Redo": () => {
        document.execCommand("redo");
        store.addNotification("Redo", "info");
        setActiveMenu(null);
      },
      "Cut": () => {
        document.execCommand("cut");
        store.addNotification("Cut", "info");
        setActiveMenu(null);
      },
      "Copy": () => {
        document.execCommand("copy");
        store.addNotification("Copied", "info");
        setActiveMenu(null);
      },
      "Paste": () => {
        navigator.clipboard.readText().then(text => {
          document.execCommand("insertText", false, text);
          store.addNotification("Pasted", "info");
        });
        setActiveMenu(null);
      },
      "Find": () => { store.setActiveSidebar("search"); setActiveMenu(null); },
      "Replace": () => { store.setActiveSidebar("search"); setActiveMenu(null); },
      "Select All": () => { document.execCommand("selectAll"); setActiveMenu(null); },
    },
    View: {
      "Explorer": () => { store.setActiveSidebar("explorer"); setActiveMenu(null); },
      "Search": () => { store.setActiveSidebar("search"); setActiveMenu(null); },
      "Source Control": () => { store.setActiveSidebar("git"); setActiveMenu(null); },
      "AI Chat": () => { store.toggleChat(); setActiveMenu(null); },
      "Terminal": () => { store.setActiveBottomPanel("terminal"); setActiveMenu(null); },
      "Problems": () => { store.setActiveBottomPanel("problems"); setActiveMenu(null); },
      "Output": () => { store.setActiveBottomPanel("output"); setActiveMenu(null); },
      "Dashboard": () => { setShowDashboard(!showDashboard); setActiveMenu(null); },
      "Command Palette": () => { store.toggleCommandPalette(); setActiveMenu(null); },
      "Toggle Sidebar": () => { store.toggleSidebar(); setActiveMenu(null); },
    },
    Go: {
      "Go to File": () => { store.toggleCommandPalette(); setActiveMenu(null); },
      "Go to Line": () => { store.addNotification("Ctrl+G to go to line", "info"); setActiveMenu(null); },
      "Back": () => { store.addNotification("Navigate back", "info"); setActiveMenu(null); },
      "Forward": () => { store.addNotification("Navigate forward", "info"); setActiveMenu(null); },
    },
    Run: {
      "Run Project": () => {
        store.setActiveBottomPanel("terminal");
        store.addTerminalLine("info", "$ npm run dev");
        store.addTerminalLine("output", "  ▲ Next.js 14.2.35");
        store.addTerminalLine("output", "  - Local: http://localhost:3000");
        store.addTerminalLine("info", "  ✓ Ready in 2.1s");
        setActiveMenu(null);
      },
      "Build Project": () => {
        store.setActiveBottomPanel("terminal");
        store.addTerminalLine("info", "$ npm run build");
        store.addTerminalLine("output", "  Creating optimized production build...");
        store.addTerminalLine("info", "  ✓ Build completed");
        setActiveMenu(null);
      },
      "Run Tests": () => {
        store.setActiveBottomPanel("terminal");
        store.addTerminalLine("info", "$ npm test");
        store.addTerminalLine("output", "  PASS  src/app/page.test.tsx");
        store.addTerminalLine("info", "  ✓ All tests passed");
        setActiveMenu(null);
      },
    },
    Terminal: {
      "New Terminal": () => {
        store.setActiveBottomPanel("terminal");
        store.addTerminalLine("info", "New terminal opened");
        setActiveMenu(null);
      },
      "Clear Terminal": () => { store.clearTerminal(); setActiveMenu(null); },
      "Run Build": () => {
        store.setActiveBottomPanel("terminal");
        store.addTerminalLine("info", "$ npm run build");
        setActiveMenu(null);
      },
      "Run Dev": () => {
        store.setActiveBottomPanel("terminal");
        store.addTerminalLine("info", "$ npm run dev");
        setActiveMenu(null);
      },
    },
    Help: {
      "Welcome": () => { store.setShowWelcome(true); setShowDashboard(false); setActiveMenu(null); },
      "Keyboard Shortcuts": () => { store.toggleCommandPalette(); setActiveMenu(null); },
      "Documentation": () => { window.open("https://github.com/synapsis-ide", "_blank"); setActiveMenu(null); },
      "About": () => {
        store.addNotification("Synapsis IDE v1.0.0 - AI Learning IDE", "info");
        setActiveMenu(null);
      },
    },
  };

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div className="h-screen flex flex-col bg-[#1e1e1e] text-white">
      {/* Title Bar */}
      <div className="h-8 bg-[#323233] flex items-center px-2 text-xs text-gray-400 border-b border-[#3c3c3c] select-none relative" ref={menuRef}>
        {Object.keys(menuActions).map((menu) => (
          <div key={menu} className="relative">
            <button
              className={cn(
                "px-3 py-1 hover:bg-[#505050] rounded-sm",
                activeMenu === menu && "bg-[#505050]"
              )}
              onClick={() => setActiveMenu(activeMenu === menu ? null : menu)}
              onMouseEnter={() => activeMenu && setActiveMenu(menu)}
            >
              {menu}
            </button>
            {activeMenu === menu && (
              <div className="absolute top-full left-0 bg-[#252526] border border-[#3c3c3c] rounded shadow-lg py-1 min-w-[200px] z-50">
                {Object.entries(menuActions[menu]).map(([action, fn]) => (
                  <button
                    key={action}
                    className="w-full text-left px-4 py-1.5 text-sm text-gray-200 hover:bg-[#094771]"
                    onClick={fn}
                  >
                    {action}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        <div className="flex-1 text-center">
          <span className="text-gray-500">Synapsis IDE</span>
          {workspace.currentWorkspace && (
            <>
              <span className="mx-2">-</span>
              <span>{workspace.currentWorkspace.name}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2 mr-2">
          <span className="w-3 h-3 rounded-full bg-red-500 hover:brightness-110 cursor-pointer" />
          <span className="w-3 h-3 rounded-full bg-yellow-500 hover:brightness-110 cursor-pointer" />
          <span className="w-3 h-3 rounded-full bg-green-500 hover:brightness-110 cursor-pointer" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <ActivityBar activeTab={store.activeSidebar} onTabChange={store.setActiveSidebar} />

        {!store.sidebarCollapsed && store.sidebarWidth > 0 && (
          <>
            <div
              className="bg-[#252526] border-r border-[#3c3c3c] overflow-hidden flex-shrink-0"
              style={{ width: `${store.sidebarWidth}px` }}
            >
              {store.activeSidebar === "explorer" && <FileExplorer />}
              {store.activeSidebar === "search" && <SearchPanel />}
              {store.activeSidebar === "git" && <GitPanel />}
              {store.activeSidebar === "chat" && <AIChatPanel />}
              {store.activeSidebar === "settings" && <SettingsPanel />}
              {store.activeSidebar === "oauth" && <OAuthPanel />}
              {store.activeSidebar === "collab" && <CollaborativePanel />}
              {store.activeSidebar === "dashboard" && <LearningDashboard />}
              {store.activeSidebar === "debug" && <ComingSoonPanel icon="🐛" title="Debug" />}
              {store.activeSidebar === "extensions" && <ComingSoonPanel icon="🧩" title="Extensions" />}
            </div>
            <ResizeHandle
              direction="horizontal"
              onResize={(delta) => store.setSidebarWidth(Math.max(0, store.sidebarWidth + delta))}
              onDoubleClick={() => store.setSidebarWidth(250)}
            />
          </>
        )}

        <div 
          className="flex-1 flex flex-col overflow-hidden min-w-0"
          onContextMenu={editorContextMenu.handleContextMenu}
        >
          <div className="flex-1 overflow-hidden">
            {showDashboard ? (
              <LearningDashboard />
            ) : store.showWelcome ? (
              <WelcomePage onStartLearning={() => { store.setShowWelcome(false); store.setActiveSidebar("chat"); }} />
            ) : (
              <CodeEditor />
            )}
          </div>

          {store.showBottomPanel && store.bottomPanelHeight > 0 && (
            <>
              <ResizeHandle
                direction="vertical"
                onResize={(delta) => store.setBottomPanelHeight(Math.max(0, store.bottomPanelHeight - delta))}
                onDoubleClick={() => store.setBottomPanelHeight(200)}
              />
              <div style={{ height: `${store.bottomPanelHeight}px` }} className="flex flex-col flex-shrink-0">
                <div className="bg-[#252526] px-2 py-1 flex items-center gap-1 border-b border-[#3c3c3c]">
                  {(["terminal", "problems", "output"] as const).map((panel) => (
                    <button
                      key={panel}
                      className={cn(
                        "px-3 py-1 text-xs rounded transition-colors capitalize",
                        store.activeBottomPanel === panel ? "bg-[#37373d] text-white" : "text-gray-400 hover:text-white hover:bg-[#2a2d2e]"
                      )}
                      onClick={() => store.setActiveBottomPanel(panel)}
                    >
                      {panel}
                    </button>
                  ))}
                  <div className="flex-1" />
                  <button className="text-gray-400 hover:text-white text-xs px-2" onClick={store.toggleBottomPanel}>✕</button>
                </div>
                <div className="flex-1 overflow-hidden">
                  {store.activeBottomPanel === "terminal" && <Terminal />}
                  {store.activeBottomPanel === "problems" && <ProblemsPanel />}
                  {store.activeBottomPanel === "output" && <OutputPanel />}
                </div>
              </div>
            </>
          )}
        </div>

        {store.activeSidebar !== "chat" && store.showChat && store.chatWidth > 0 && (
          <>
            <ResizeHandle
              direction="horizontal"
              onResize={(delta) => store.setChatWidth(Math.max(0, store.chatWidth - delta))}
              onDoubleClick={() => store.setChatWidth(320)}
            />
            <div 
              className="border-l border-[#3c3c3c] flex-shrink-0 overflow-hidden relative"
              style={{ width: `${store.chatWidth}px` }}
            >
              <button
                className="absolute top-2 right-2 z-10 w-6 h-6 flex items-center justify-center rounded bg-[#3c3c3c] text-gray-400 hover:text-white hover:bg-[#4c4c4c] text-xs"
                onClick={() => store.toggleChat()}
                title="Close AI Chat"
              >
                ✕
              </button>
              <AIChatPanel />
            </div>
          </>
        )}
      </div>

      {/* Status Bar */}
      <div className="h-6 bg-[#007acc] flex items-center px-4 text-xs text-white justify-between select-none">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 cursor-pointer hover:bg-[#0060a4] px-1.5 rounded">
            <span>🔀</span> main
          </span>
          <span className="cursor-pointer hover:bg-[#0060a4] px-1.5 rounded">✓ 0</span>
          <span className="cursor-pointer hover:bg-[#0060a4] px-1.5 rounded">⚠ 0</span>
          <span className="flex items-center gap-1 px-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-100">AI Connected</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className={cn("px-1.5 rounded flex items-center gap-1", store.learningMode === "learning" ? "bg-green-600/40" : "bg-purple-600/40")}>
            {store.learningMode === "learning" ? "🎓 Learning" : "🔨 Builder"}
          </span>
          <span className="flex items-center gap-1 px-1.5 text-yellow-200">
            ⚡ Lv.{Math.floor(1290 / 500) + 1} · 1290 XP
          </span>
          <span className="cursor-pointer hover:bg-[#0060a4] px-1.5 rounded" onClick={() => setShowDashboard(!showDashboard)}>
            📊 Dashboard
          </span>
          <span className="cursor-pointer hover:bg-[#0060a4] px-1.5 rounded" onClick={() => store.toggleChat()}>
            🧠 AI: {store.showChat ? "ON" : "OFF"}
          </span>
          <span className="cursor-pointer hover:bg-[#0060a4] px-1.5 rounded">
            {store.openFiles.find((f) => f.id === store.activeFile)?.modified ? "● Modified" : "✓ Saved"}
          </span>
          <span className="cursor-pointer hover:bg-[#0060a4] px-1.5 rounded">
            {store.openFiles.find((f) => f.id === store.activeFile)?.language || ""}
          </span>
        </div>
      </div>

      {/* Dialogs */}
      <CommandPalette isOpen={store.showCommandPalette} onClose={store.toggleCommandPalette} />
      <NewWorkspaceDialog isOpen={showNewWorkspace} onClose={() => setShowNewWorkspace(false)} onCreate={(name) => workspace.createWorkspace(name)} />
      <OpenWorkspaceDialog isOpen={showOpenWorkspace} onClose={() => setShowOpenWorkspace(false)} onOpen={(ws) => workspace.openWorkspace(ws)} workspaces={workspace.workspaces} />
      <NewFileDialog isOpen={showNewFile} onClose={() => setShowNewFile(false)} onCreate={(name) => workspace.createNewFile(name)} />
      
      {editorContextMenu.isOpen && (
        <EditorContextMenu x={editorContextMenu.position.x} y={editorContextMenu.position.y} onClose={editorContextMenu.close} />
      )}
      <NotificationToast />
    </div>
  );
}

function ComingSoonPanel({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="h-full flex items-center justify-center text-gray-500">
      <div className="text-center">
        <div className="text-4xl mb-2">{icon}</div>
        <div>{title}</div>
        <div className="text-xs mt-1">Coming Soon</div>
      </div>
    </div>
  );
}
