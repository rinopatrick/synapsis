"use client";

import { useAIChat } from "@/hooks/use-ai-chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function ChatInterface() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
  } = useAIChat();

  return (
    <Card className="flex flex-col h-[600px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-primary">Synapsis</span>
          <span className="text-sm font-normal text-muted-foreground">
            AI Learning Assistant
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-auto space-y-4 mb-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-4xl mb-4">🧠</div>
            <h3 className="text-lg font-semibold mb-2">
              Welcome to Synapsis
            </h3>
            <p className="text-muted-foreground max-w-md">
              Tell me what you want to build, and I&apos;ll help you learn the
              process step by step. I won&apos;t give you the answer directly
              — instead, I&apos;ll guide you to discover it yourself.
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-lg px-4 py-2",
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              )}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg px-4 py-2">
              <div className="flex items-center gap-2">
                <div className="animate-pulse">Thinking...</div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center">
            <div className="bg-destructive/10 text-destructive rounded-lg px-4 py-2 text-sm">
              Error: {error.message}
            </div>
          </div>
        )}
      </CardContent>

      <form onSubmit={handleSubmit} className="flex gap-2 p-4 pt-0">
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="Tell me what you want to build..."
          disabled={isLoading}
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send"}
        </Button>
      </form>
    </Card>
  );
}
