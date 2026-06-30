"use client";

import { useState, useEffect } from "react";
import { useIDEStore } from "@/hooks/use-ide-store";

interface Provider {
  id: string;
  name: string;
  icon: string;
  description: string;
  features: string[];
  authMethods: ("oauth" | "api-key" | "token")[];
  signupUrl: string;
  tokenHelp?: string;
}

const providers: Provider[] = [
  {
    id: "ollama",
    name: "Ollama (Local)",
    icon: "🦙",
    description: "Run models locally - 100% free",
    features: ["Llama 3.2", "Mistral", "Qwen", "DeepSeek"],
    authMethods: [],
    signupUrl: "https://ollama.com/download",
  },
  {
    id: "openai",
    name: "OpenAI (ChatGPT)",
    icon: "🤖",
    description: "GPT-4o, GPT-4 Turbo, o1, Codex",
    features: ["GPT-4o", "GPT-4 Turbo", "o1", "Codex"],
    authMethods: ["token", "api-key"],
    signupUrl: "https://platform.openai.com/api-keys",
    tokenHelp: "Login ke ChatGPT → F12 → Application → Cookies → copy access token",
  },
  {
    id: "anthropic",
    name: "Anthropic (Claude)",
    icon: "🧠",
    description: "Claude 3.5 Sonnet, Claude 3 Opus",
    features: ["Claude 3.5 Sonnet", "Claude 3 Opus", "200K context"],
    authMethods: ["api-key"],
    signupUrl: "https://console.anthropic.com/settings/keys",
  },
  {
    id: "google",
    name: "Google AI",
    icon: "✨",
    description: "Gemini 1.5 Pro, Gemini 1.5 Flash",
    features: ["Gemini 1.5 Pro", "Gemini 1.5 Flash", "1M context"],
    authMethods: ["api-key"],
    signupUrl: "https://makersuite.google.com/app/apikey",
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    icon: "🔀",
    description: "Access 200+ models with one key",
    features: ["All models", "Pay-per-use", "No lock-in"],
    authMethods: ["api-key"],
    signupUrl: "https://openrouter.ai/keys",
  },
];

export function OAuthPanel() {
  const [connections, setConnections] = useState<Record<string, {
    connected: boolean;
    method: string;
    credential: string;
    models?: string[];
  }>>({});

  const [activeProvider, setActiveProvider] = useState<string | null>(null);
  const [authMethod, setAuthMethod] = useState<"token" | "api-key" | "oauth">("api-key");
  const [inputValue, setInputValue] = useState("");
  const [connecting, setConnecting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { addNotification } = useIDEStore();

  useEffect(() => {
    const saved = localStorage.getItem("synapsis-connections");
    if (saved) try { setConnections(JSON.parse(saved)); } catch {}
  }, []);

  const save = (c: Record<string, any>) => {
    setConnections(c);
    localStorage.setItem("synapsis-connections", JSON.stringify(c));
  };

  // Ollama auto-detect
  const connectOllama = async () => {
    setConnecting("ollama");
    setError(null);
    try {
      const r = await fetch("http://localhost:11434/api/tags", { signal: AbortSignal.timeout(5000) });
      if (!r.ok) throw new Error("Not responding");
      const d = await r.json();
      const m = d.models?.map((x: any) => x.name) || [];
      if (!m.length) { setError("No models. Run: ollama pull llama3.2"); setConnecting(null); return; }
      save({ ...connections, ollama: { connected: true, method: "local", credential: "", models: m } });
      addNotification(`Ollama connected! ${m.length} models.`, "success");
    } catch { setError("Ollama not running. Run: ollama serve"); }
    setConnecting(null);
  };

  // Connect with credential (API key or token)
  const connect = async (providerId: string) => {
    if (!inputValue.trim()) return;
    setConnecting(providerId);
    setError(null);

    try {
      const provider = providers.find(p => p.id === providerId)!;
      
      if (authMethod === "token") {
        // Token auth - use Codex endpoint
        const result = await testToken(providerId, inputValue.trim());
        if (result.ok) {
          save({ ...connections, [providerId]: { connected: true, method: "token", credential: inputValue.trim() } });
          setActiveProvider(null);
          setInputValue("");
          addNotification(`Connected via token!`, "success");
        } else {
          setError(result.error || "Invalid token");
        }
      } else {
        // API key auth
        const result = await testApiKey(providerId, inputValue.trim());
        if (result.ok) {
          save({ ...connections, [providerId]: { connected: true, method: "api-key", credential: inputValue.trim(), models: result.models } });
          setActiveProvider(null);
          setInputValue("");
          addNotification("Connected!", "success");
        } else {
          setError(result.error || "Invalid key");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connection failed");
    }
    setConnecting(null);
  };

  // Test token (for Codex OAuth)
  const testToken = async (providerId: string, token: string) => {
    if (providerId === "openai") {
      // Test with Codex endpoint
      try {
        const r = await fetch("https://chatgpt.com/backend-api/codex", {
          headers: { Authorization: `Bearer ${token}` },
          signal: AbortSignal.timeout(10000),
        });
        if (r.ok) return { ok: true };
        return { ok: false, error: `HTTP ${r.status}` };
      } catch (e: any) {
        return { ok: false, error: e.message };
      }
    }
    return { ok: false, error: "Token auth not supported for this provider" };
  };

  // Test API key
  const testApiKey = async (id: string, key: string) => {
    let url: string, h: Record<string, string> = {};
    if (id === "openai") { url = "https://api.openai.com/v1/models"; h = { Authorization: `Bearer ${key}` }; }
    else if (id === "anthropic") { url = "https://api.anthropic.com/v1/messages"; h = { "x-api-key": key, "anthropic-version": "2023-06-01" }; }
    else if (id === "google") { url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`; }
    else if (id === "openrouter") { url = "https://openrouter.ai/api/v1/models"; h = { Authorization: `Bearer ${key}` }; }
    else return { ok: false, error: "Unknown" };

    const r = await fetch(url, { headers: h, signal: AbortSignal.timeout(10000) });
    if (!r.ok) { const e = await r.json().catch(() => ({})); return { ok: false, error: e.error?.message || `HTTP ${r.status}` }; }
    const d = await r.json();
    let models: string[] = [];
    if (id === "openai" && d.data) models = d.data.map((m: any) => m.id).filter((m: string) => m.includes("gpt") || m.includes("o1")).slice(0, 10);
    else if (id === "openrouter" && d.data) models = d.data.map((m: any) => m.id).slice(0, 10);
    else if (id === "google" && d.models) models = d.models.map((m: any) => m.name?.replace("models/", "")).filter(Boolean).slice(0, 10);
    return { ok: true, models };
  };

  const disconnect = (id: string) => {
    const c = { ...connections }; delete c[id]; save(c);
    addNotification("Disconnected", "info");
  };

  const activeProv = providers.find(p => p.id === activeProvider);

  return (
    <div className="h-full bg-[#252526] flex flex-col">
      <div className="px-4 py-3 border-b border-[#3c3c3c]">
        <div className="text-sm font-medium text-white">AI Providers</div>
        <div className="text-xs text-gray-400 mt-1">
          {Object.values(connections).filter(c => c.connected).length || "No"} connected
        </div>
      </div>

      {/* Connect Modal */}
      {activeProvider && activeProv && (
        <div className="p-4 border-b border-[#3c3c3c] bg-[#1e1e1e]">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">{activeProv.icon}</span>
            <div className="text-sm font-medium text-white">{activeProv.name}</div>
          </div>

          {/* Auth method tabs */}
          {activeProv.authMethods.length > 1 && (
            <div className="flex gap-1 mb-3">
              {activeProv.authMethods.map(m => (
                <button
                  key={m}
                  className={`flex-1 text-xs px-2 py-1.5 rounded ${authMethod === m ? "bg-[#094771] text-white" : "bg-[#3c3c3c] text-gray-400"}`}
                  onClick={() => { setAuthMethod(m); setInputValue(""); setError(null); }}
                >
                  {m === "token" ? "Session Token" : "API Key"}
                </button>
              ))}
            </div>
          )}

          <input
            type="password"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => e.key === "Enter" && connect(activeProvider)}
            placeholder={authMethod === "token" ? "Paste session token..." : "sk-..."}
            className="w-full bg-[#3c3c3c] text-white rounded px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500 mb-2"
            autoFocus
          />

          {error && <div className="text-xs text-red-400 mb-2">✕ {error}</div>}

          {authMethod === "token" && activeProv.tokenHelp && (
            <div className="text-[10px] text-gray-500 mb-2 bg-[#252526] p-2 rounded">
              💡 {activeProv.tokenHelp}
            </div>
          )}

          <div className="flex gap-2">
            <button
              className="flex-1 text-xs px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              onClick={() => connect(activeProvider)}
              disabled={!inputValue.trim() || !!connecting}
            >
              {connecting ? "Testing..." : "Connect"}
            </button>
            <button
              className="text-xs px-3 py-2 text-gray-400 hover:text-white"
              onClick={() => { setActiveProvider(null); setInputValue(""); setError(null); }}
            >
              Cancel
            </button>
          </div>

          {authMethod === "api-key" && (
            <div className="text-[10px] text-gray-500 mt-2">
              Get key at <a href={activeProv.signupUrl} target="_blank" className="text-blue-400 underline">{activeProv.signupUrl.replace("https://", "")}</a>
            </div>
          )}
        </div>
      )}

      {/* Providers */}
      <div className="flex-1 overflow-auto p-4 space-y-3">
        {providers.map(p => {
          const c = connections[p.id];
          const isConn = c?.connected;
          const isLoading = connecting === p.id;

          return (
            <div key={p.id} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{p.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-white">{p.name}</div>
                      <div className="text-xs text-gray-400">{p.description}</div>
                    </div>
                    {isConn && <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">✓</span>}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {p.features.map(f => <span key={f} className="text-[10px] px-1.5 py-0.5 rounded bg-[#3c3c3c] text-gray-500">{f}</span>)}
                  </div>
                  {isConn && c && (
                    <div className="mt-3 p-2 bg-[#252526] rounded text-xs">
                      <div className="text-green-400">Connected ({c.method})</div>
                    </div>
                  )}
                  <div className="mt-3">
                    {isConn ? (
                      <button className="text-xs px-3 py-1.5 rounded bg-red-600/20 text-red-400 hover:bg-red-600/30 w-full" onClick={() => disconnect(p.id)}>Disconnect</button>
                    ) : p.id === "ollama" ? (
                      <button className="text-xs px-3 py-1.5 rounded bg-[#094771] text-white hover:bg-[#0a5a8a] w-full disabled:opacity-50" onClick={connectOllama} disabled={isLoading}>{isLoading ? "..." : "Auto-detect"}</button>
                    ) : (
                      <button
                        className="text-xs px-3 py-1.5 rounded bg-[#094771] text-white hover:bg-[#0a5a8a] w-full"
                        onClick={() => { setActiveProvider(p.id); setAuthMethod(p.authMethods[0] || "api-key"); setInputValue(""); setError(null); }}
                      >
                        Connect
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t border-[#3c3c3c] text-xs text-gray-500">
        <div className="font-medium text-gray-400 mb-1">Quick Start (Free)</div>
        <ol className="list-decimal list-inside space-y-1">
          <li>Install <a href="https://ollama.com/download" target="_blank" className="text-blue-400 underline">Ollama</a></li>
          <li>Run: <code className="bg-[#3c3c3c] px-1 rounded">ollama serve</code></li>
          <li>Pull: <code className="bg-[#3c3c3c] px-1 rounded">ollama pull llama3.2</code></li>
          <li>Click "Auto-detect"</li>
        </ol>
      </div>
    </div>
  );
}
