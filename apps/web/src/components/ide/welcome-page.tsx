"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useIDEStore } from "@/hooks/use-ide-store";
import { cn } from "@/lib/utils";

interface WelcomePageProps {
  onStartLearning?: () => void;
}

const recentProjects = [
  { name: "todo-app", language: "React", lastOpened: "2 hours ago", icon: "📁" },
  { name: "api-server", language: "Node.js", lastOpened: "Yesterday", icon: "📁" },
  { name: "portfolio-site", language: "Next.js", lastOpened: "3 days ago", icon: "📁" },
];

export function WelcomePage({ onStartLearning }: WelcomePageProps) {
  const { setShowWelcome, setActiveSidebar, addNotification, setLearningMode } = useIDEStore();
  const [logoScale, setLogoScale] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setLogoScale(true), 100);
    const t2 = setTimeout(() => setShowContent(true), 400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

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
      <div className="max-w-5xl mx-auto p-8 pt-16">
        {/* Animated Logo */}
        <div className="text-center mb-12">
          <div className={cn(
            "inline-block transition-all duration-700 ease-out",
            logoScale ? "scale-100 opacity-100" : "scale-50 opacity-0"
          )}>
            <div className="relative inline-block">
              <div className="text-7xl mb-4 animate-pulse">🧠</div>
              <div className="absolute -inset-4 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
            </div>
          </div>
          <h1 className={cn(
            "text-5xl font-bold text-white mb-3 transition-all duration-500 delay-200",
            showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            Welcome to <span className="text-blue-400">Synapsis</span>
          </h1>
          <p className={cn(
            "text-gray-400 text-lg transition-all duration-500 delay-300",
            showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            AI Learning IDE — Form the connection. Learn the code.
          </p>
        </div>

        {/* Quick Start Buttons */}
        <div className={cn(
          "grid grid-cols-3 gap-4 mb-12 transition-all duration-500 delay-400",
          showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <button
            onClick={() => { setLearningMode("learning"); setShowWelcome(false); onStartLearning?.(); }}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-left hover:from-blue-500 hover:to-blue-600 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/20"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative">
              <div className="text-3xl mb-3">🎓</div>
              <h3 className="text-white font-semibold text-lg mb-1">Start Learning</h3>
              <p className="text-blue-100 text-sm">Guided tutorials with AI assistance</p>
            </div>
          </button>
          <button
            onClick={() => { setLearningMode("builder"); setShowWelcome(false); }}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 p-6 text-left hover:from-purple-500 hover:to-purple-600 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/20"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative">
              <div className="text-3xl mb-3">🔨</div>
              <h3 className="text-white font-semibold text-lg mb-1">Builder Mode</h3>
              <p className="text-purple-100 text-sm">Full IDE with AI pair programming</p>
            </div>
          </button>
          <button
            onClick={handleOpenFolder}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-[#2a2a2a] to-[#333333] border border-[#3c3c3c] p-6 text-left hover:border-gray-500 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative">
              <div className="text-3xl mb-3">📂</div>
              <h3 className="text-white font-semibold text-lg mb-1">Open Project</h3>
              <p className="text-gray-400 text-sm">Continue where you left off</p>
            </div>
          </button>
        </div>

        {/* Recent Projects */}
        <div className={cn(
          "mb-12 transition-all duration-500 delay-500",
          showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-gray-400">⏱</span> Recent Projects
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {recentProjects.map((project, i) => (
              <button
                key={i}
                onClick={() => { setShowWelcome(false); addNotification(`Opened: ${project.name}`, "success"); }}
                className="flex items-center gap-3 bg-[#252526] border border-[#3c3c3c] rounded-lg p-3 text-left hover:border-blue-500/50 hover:bg-[#2a2a2a] transition-all duration-200"
              >
                <span className="text-xl">{project.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white font-medium truncate">{project.name}</div>
                  <div className="text-xs text-gray-500">{project.language} · {project.lastOpened}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Learning Paths */}
        <div className={cn(
          "mb-12 transition-all duration-500 delay-600",
          showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-blue-400">🎯</span> Start Learning
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { title: "Build a Todo App", desc: "Learn React basics", level: "Beginner", time: "30 min", color: "green" },
              { title: "Create a REST API", desc: "Learn Node.js & Express", level: "Beginner", time: "45 min", color: "green" },
              { title: "Full-Stack App", desc: "Next.js + Database", level: "Intermediate", time: "2 hours", color: "yellow" },
              { title: "Authentication System", desc: "JWT & OAuth", level: "Intermediate", time: "1 hour", color: "yellow" },
            ].map((item, i) => (
              <button
                key={i}
                onClick={() => handleStartLearning(item.title)}
                className="flex items-center gap-4 bg-[#252526] border border-[#3c3c3c] rounded-lg p-4 text-left hover:border-blue-500/50 hover:bg-[#2a2a2a] transition-all duration-200 group"
              >
                <div className="flex-1">
                  <h3 className="text-white font-medium mb-1 group-hover:text-blue-400 transition-colors">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full",
                    item.color === "green" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                  )}>
                    {item.level}
                  </span>
                  <span className="text-xs text-gray-500">⏱ {item.time}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Feature Highlights */}
        <div className={cn(
          "mb-12 transition-all duration-500 delay-700",
          showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-purple-400">✨</span> Features
          </h2>
          <div className="grid grid-cols-4 gap-3">
            {[
              { icon: "💡", title: "AI Hints", desc: "Get hints, not answers" },
              { icon: "🔍", title: "Code Review", desc: "AI-powered reviews" },
              { icon: "📊", title: "Progress", desc: "Track your learning" },
              { icon: "⌨️", title: "Shortcuts", desc: "Ctrl+Shift+P" },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-[#252526] border border-[#3c3c3c] rounded-lg p-4 text-center hover:border-purple-500/50 transition-colors"
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="text-sm font-medium text-white">{item.title}</div>
                <div className="text-xs text-gray-400 mt-1">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className={cn(
          "text-center text-gray-500 text-sm transition-all duration-500 delay-800",
          showContent ? "opacity-100" : "opacity-0"
        )}>
          <p>Synapsis IDE v1.0.0</p>
          <p className="mt-1">
            Press <span className="bg-[#3c3c3c] px-2 py-0.5 rounded font-mono text-gray-400">Ctrl+Shift+P</span> for Command Palette
          </p>
        </div>
      </div>
    </div>
  );
}
