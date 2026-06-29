"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useIDEStore } from "@/hooks/use-ide-store";

interface WelcomePageProps {
  onStartLearning?: () => void;
}

export function WelcomePage({ onStartLearning }: WelcomePageProps) {
  const { setShowWelcome, setActiveSidebar, addNotification, setLearningMode } = useIDEStore();

  const handleNewProject = () => {
    setShowWelcome(false);
    addNotification("New project created", "success");
  };

  const handleOpenFolder = () => {
    setShowWelcome(false);
    addNotification("Folder opened", "success");
  };

  const handleStartLearning = (path: string) => {
    setShowWelcome(false);
    setLearningMode("learning");
    onStartLearning?.();
    addNotification(`Started: ${path}`, "success");
  };

  return (
    <div className="h-full bg-[#1e1e1e] overflow-auto">
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🧠</div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome to <span className="text-blue-400">Synapsis</span>
          </h1>
          <p className="text-gray-400 text-lg">AI Learning IDE — Form the connection. Learn the code.</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          <Card className="bg-[#252526] border-[#3c3c3c] hover:border-blue-500 cursor-pointer transition-colors" onClick={handleNewProject}>
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-3">📁</div>
              <h3 className="text-white font-medium mb-1">New Project</h3>
              <p className="text-sm text-gray-400">Start a new project</p>
            </CardContent>
          </Card>
          <Card className="bg-[#252526] border-[#3c3c3c] hover:border-blue-500 cursor-pointer transition-colors" onClick={handleOpenFolder}>
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-3">📂</div>
              <h3 className="text-white font-medium mb-1">Open Folder</h3>
              <p className="text-sm text-gray-400">Open existing project</p>
            </CardContent>
          </Card>
          <Card className="bg-[#252526] border-[#3c3c3c] hover:border-blue-500 cursor-pointer transition-colors" onClick={() => setActiveSidebar("chat")}>
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-3">💬</div>
              <h3 className="text-white font-medium mb-1">AI Chat</h3>
              <p className="text-sm text-gray-400">Ask AI anything</p>
            </CardContent>
          </Card>
        </div>

        {/* Learning Paths */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-4">🎯 Start Learning</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { title: "Build a Todo App", desc: "Learn React basics", level: "Beginner", time: "30 min" },
              { title: "Create a REST API", desc: "Learn Node.js & Express", level: "Beginner", time: "45 min" },
              { title: "Full-Stack App", desc: "Next.js + Database", level: "Intermediate", time: "2 hours" },
              { title: "Authentication System", desc: "JWT & OAuth", level: "Intermediate", time: "1 hour" },
            ].map((item, i) => (
              <Card key={i} className="bg-[#252526] border-[#3c3c3c] hover:border-blue-500 cursor-pointer transition-colors" onClick={() => handleStartLearning(item.title)}>
                <CardContent className="p-4">
                  <h3 className="text-white font-medium mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-400 mb-2">{item.desc}</p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">{item.level}</span>
                    <span className="text-gray-500">⏱ {item.time}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-4">⌨️ Keyboard Shortcuts</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { shortcut: "Ctrl+Shift+P", desc: "Command Palette" },
              { shortcut: "Ctrl+`", desc: "Toggle Terminal" },
              { shortcut: "Ctrl+B", desc: "Toggle Sidebar" },
              { shortcut: "Ctrl+Shift+E", desc: "Show Explorer" },
              { shortcut: "Ctrl+S", desc: "Save File" },
              { shortcut: "Ctrl+W", desc: "Close Tab" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between bg-[#252526] rounded-lg p-3 border border-[#3c3c3c]">
                <span className="text-sm text-gray-300">{item.desc}</span>
                <span className="text-xs bg-[#3c3c3c] text-gray-400 px-2 py-1 rounded font-mono">{item.shortcut}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Features */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-4">🧠 AI Features</h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: "💡", title: "Hints", desc: "Get hints not answers", action: () => setActiveSidebar("chat") },
              { icon: "🤔", title: "Why?", desc: "Understand reasoning", action: () => setActiveSidebar("chat") },
              { icon: "📝", title: "Code Review", desc: "AI reviews code", action: () => setActiveSidebar("chat") },
              { icon: "🔍", title: "Debug", desc: "Fix errors together", action: () => setActiveSidebar("chat") },
              { icon: "🎯", title: "Decisions", desc: "Learn to choose", action: () => setActiveSidebar("chat") },
              { icon: "📊", title: "Progress", desc: "Track learning", action: () => {} },
            ].map((item, i) => (
              <Card key={i} className="bg-[#252526] border-[#3c3c3c] hover:border-blue-500 cursor-pointer transition-colors" onClick={item.action}>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <h3 className="text-white text-sm font-medium mb-1">{item.title}</h3>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center text-gray-500 text-sm">
          <p>Synapsis IDE v1.0.0</p>
          <p className="mt-1">Press <span className="bg-[#3c3c3c] px-2 py-0.5 rounded font-mono">Ctrl+Shift+P</span> for Command Palette</p>
        </div>
      </div>
    </div>
  );
}
