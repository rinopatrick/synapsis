"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useIDEStore } from "@/hooks/use-ide-store";
import { useCodeContext } from "@/hooks/use-code-context";

interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
}

interface Provider {
  id: string;
  name: string;
  available: boolean;
  models: string[];
}

export function AIChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "system",
      content: "Welcome to Synapsis! I'm your AI learning assistant.\n\nAsk me anything or use the quick actions below!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState("ollama");
  const [selectedModel, setSelectedModel] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [includeContext, setIncludeContext] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { learningMode, addNotification } = useIDEStore();
  const { buildContextPrompt, getCurrentFileName } = useCodeContext();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const res = await fetch("/api/providers");
      const data = await res.json();
      setProviders(data.providers || []);
      const available = data.providers?.find((p: Provider) => p.available);
      if (available) {
        setSelectedProvider(available.id);
        if (available.models?.length) setSelectedModel(available.models[0]);
      }
    } catch (e) {
      console.error("Failed to fetch providers:", e);
    }
  };

  const handleSend = useCallback(async () => {
    if (!input.trim() || isStreaming) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsStreaming(true);

    const assistantId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: assistantId, role: "assistant", content: "" }]);

    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    try {
      let content = input;
      if (includeContext) {
        const ctx = buildContextPrompt(input);
        if (ctx) content += "\n\n" + ctx;
      }

      const apiMessages = [...messages, { ...userMsg, content }]
        .filter(m => m.role !== "system")
        .map(m => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages, provider: selectedProvider, apiKey: apiKey || undefined, model: selectedModel || undefined }),
        signal: abortControllerRef.current.signal,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split("\n")) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();
            if (data === "[DONE]") continue;
            try {
              const json = JSON.parse(data);
              if (json.content) {
                accumulated += json.content;
                setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: accumulated } : m));
              }
            } catch {}
          }
        }
      }
    } catch (error: any) {
      if (error.name === "AbortError") return;
      const msg = error.message || "Unknown error";
      setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: `Error: ${msg}\n\nMake sure Ollama is running (ollama serve) or add an API key in settings.` } : m));
      addNotification("Chat error: " + msg, "error");
    } finally {
      setIsStreaming(false);
    }
  }, [input, isStreaming, messages, selectedProvider, selectedModel, apiKey, includeContext, addNotification, buildContextPrompt]);

  const handleQuickAction = (action: string) => {
    const msgs: Record<string, string> = {
      hint: "Give me a hint for what I'm working on",
      why: "Explain why this approach is recommended",
      explain: "Explain the code I'm looking at",
      debug: "Help me debug this error",
    };
    setInput(msgs[action] || action);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const currentProvider = providers.find(p => p.id === selectedProvider);

  return (
    <div className="h-full bg-[#252526] flex flex-col">
      {/* Header */}
      <div className="px-4 py-2 border-b border-[#3c3c3c] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>🧠</span>
          <span className="text-sm font-medium text-white">Synapsis AI</span>
          <span className={cn("text-xs px-2 py-0.5 rounded-full", learningMode === "learning" ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400")}>
            {learningMode === "learning" ? "Learning" : "Builder"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <button className="hover:text-white text-xs" onClick={() => setShowSettings(!showSettings)}>⚙️</button>
          <button className="hover:text-white text-xs" onClick={() => { setMessages([{ id: "1", role: "system", content: "Chat cleared." }]); addNotification("Chat cleared", "info"); }}>Clear</button>
        </div>
      </div>

      {/* Settings */}
      {showSettings && (
        <div className="px-4 py-3 border-b border-[#3c3c3c] bg-[#1e1e1e] space-y-2">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Provider</label>
            <select value={selectedProvider} onChange={e => { setSelectedProvider(e.target.value); const p = providers.find(p => p.id === e.target.value); if (p?.models?.length) setSelectedModel(p.models[0]); }} className="w-full bg-[#3c3c3c] text-white rounded px-2 py-1 text-xs outline-none">
              {providers.map(p => <option key={p.id} value={p.id} disabled={!p.available}>{p.name} {!p.available && "(unavailable)"}</option>)}
            </select>
          </div>
          {currentProvider?.models && currentProvider.models.length > 0 && (
            <div>
              <label className="text-xs text-gray-400 block mb-1">Model</label>
              <select value={selectedModel} onChange={e => setSelectedModel(e.target.value)} className="w-full bg-[#3c3c3c] text-white rounded px-2 py-1 text-xs outline-none">
                {currentProvider.models.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          )}
          {selectedProvider !== "ollama" && (
            <div>
              <label className="text-xs text-gray-400 block mb-1">API Key</label>
              <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="Enter API key..." className="w-full bg-[#3c3c3c] text-white rounded px-2 py-1 text-xs outline-none" />
            </div>
          )}
          <div className="flex items-center gap-2">
            <input type="checkbox" id="ctx" checked={includeContext} onChange={e => setIncludeContext(e.target.checked)} className="rounded" />
            <label htmlFor="ctx" className="text-xs text-gray-400">Include code context</label>
          </div>
          <div className="text-xs text-gray-500">
            {selectedProvider === "ollama" ? "💡 Run: ollama serve" : `💡 Get key from ${currentProvider?.name}`}
          </div>
        </div>
      )}

      {/* Context indicator */}
      {includeContext && getCurrentFileName() && (
        <div className="px-4 py-1 bg-blue-500/10 border-b border-blue-500/20 text-xs text-blue-400">
          📎 {getCurrentFileName()}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
            <div className={cn("max-w-[90%] rounded-lg px-3 py-2 text-sm", msg.role === "user" && "bg-blue-600 text-white", msg.role === "assistant" && "bg-[#37373d] text-gray-200", msg.role === "system" && "bg-[#1e1e1e] text-gray-400 border border-[#3c3c3c]")}>
              {msg.role === "assistant" && <div className="flex items-center gap-1 mb-1 text-xs text-gray-400"><span>🧠</span><span>Synapsis</span></div>}
              <div className="whitespace-pre-wrap">{msg.content}</div>
              {isStreaming && msg.id === messages[messages.length - 1]?.id && msg.role === "assistant" && <span className="inline-block w-2 h-4 bg-white animate-pulse ml-1" />}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Quick actions */}
      <div className="px-4 py-2 border-t border-[#3c3c3c] flex gap-2">
        {[{ id: "hint", icon: "💡", label: "Hint" }, { id: "why", icon: "🤔", label: "Why?" }, { id: "explain", icon: "📝", label: "Explain" }, { id: "debug", icon: "🔍", label: "Debug" }].map(a => (
          <button key={a.id} className="text-xs px-3 py-1 rounded-full bg-[#37373d] text-gray-300 hover:bg-[#47474d] flex items-center gap-1" onClick={() => handleQuickAction(a.id)} disabled={isStreaming}>
            <span>{a.icon}</span><span>{a.label}</span>
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-[#3c3c3c]">
        <div className="flex gap-2">
          <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} className="flex-1 bg-[#3c3c3c] text-white rounded-lg px-3 py-2 text-sm resize-none outline-none focus:ring-1 focus:ring-blue-500" placeholder={isStreaming ? "Thinking..." : `Ask anything...`} rows={2} disabled={isStreaming} />
          <button onClick={handleSend} disabled={!input.trim() || isStreaming} className="px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {isStreaming ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
