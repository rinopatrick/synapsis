"use client";

import { useAppStore } from "@/hooks/use-app-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const {
    learningMode,
    setLearningMode,
    userLevel,
    setUserLevel,
    aiConfig,
    setAIConfig,
    skipTopics,
    addSkipTopic,
    removeSkipTopic,
    sidebarOpen,
    toggleSidebar,
  } = useAppStore();

  if (!sidebarOpen) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50"
      >
        ☰
      </Button>
    );
  }

  return (
    <div className="w-64 border-r bg-muted/30 p-4 space-y-4 overflow-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Settings</h2>
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          ✕
        </Button>
      </div>

      {/* Learning Mode */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Mode</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex gap-2">
            <Button
              variant={learningMode === "learning" ? "default" : "outline"}
              size="sm"
              onClick={() => setLearningMode("learning")}
              className="flex-1"
            >
              🧠 Learning
            </Button>
            <Button
              variant={learningMode === "builder" ? "default" : "outline"}
              size="sm"
              onClick={() => setLearningMode("builder")}
              className="flex-1"
            >
              🔧 Builder
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            {learningMode === "learning"
              ? "AI will guide you through decisions"
              : "AI will implement directly"}
          </p>
        </CardContent>
      </Card>

      {/* User Level */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Level</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex flex-col gap-2">
            {(["beginner", "intermediate", "advanced"] as const).map(
              (level) => (
                <Button
                  key={level}
                  variant={userLevel === level ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUserLevel(level)}
                  className="justify-start capitalize"
                >
                  {level === "beginner" && "🌱"}
                  {level === "intermediate" && "🌿"}
                  {level === "advanced" && "🌳"}
                  {level}
                </Button>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {/* AI Provider */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">AI Provider</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex flex-col gap-2">
            {(["ollama", "openai", "anthropic"] as const).map((provider) => (
              <Button
                key={provider}
                variant={
                  aiConfig.provider === provider ? "default" : "outline"
                }
                size="sm"
                onClick={() => setAIConfig({ provider })}
                className="justify-start capitalize"
              >
                {provider === "ollama" && "🦙"}
                {provider === "openai" && "🤖"}
                {provider === "anthropic" && "🧠"}
                {provider}
              </Button>
            ))}
          </div>
          {aiConfig.provider === "ollama" && (
            <p className="text-xs text-muted-foreground">
              Make sure Ollama is running locally
            </p>
          )}
        </CardContent>
      </Card>

      {/* Skip Topics */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Skip Topics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-2">
            Topics you already know (AI won&apos;t ask about these)
          </p>
          <div className="flex flex-wrap gap-1">
            {["HTML", "CSS", "JavaScript", "Git", "React"].map((topic) => (
              <Button
                key={topic}
                variant={
                  skipTopics.includes(topic) ? "default" : "outline"
                }
                size="sm"
                onClick={() => {
                  if (skipTopics.includes(topic)) {
                    removeSkipTopic(topic);
                  } else {
                    addSkipTopic(topic);
                  }
                }}
                className="text-xs"
              >
                {topic}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
