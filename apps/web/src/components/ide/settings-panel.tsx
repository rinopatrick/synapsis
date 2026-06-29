"use client";

import { useState, useEffect } from "react";
import { useIDEStore } from "@/hooks/use-ide-store";
import { useThemeStore, type Theme } from "@/hooks/use-theme";

interface Provider {
  id: string;
  name: string;
  available: boolean;
  models: string[];
}

export function SettingsPanel() {
  const {
    learningMode,
    userLevel,
    setLearningMode,
    setUserLevel,
    addNotification,
  } = useIDEStore();

  const { currentTheme, setTheme: setGlobalTheme } = useThemeStore();

  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState("ollama");
  const [selectedModel, setSelectedModel] = useState("");
  const [apiKey, setInputApiKey] = useState("");
  const [fontSize, setFontSize] = useState(14);
  const [theme, setTheme] = useState(currentTheme);
  const [autoSave, setAutoSave] = useState("afterDelay");

  useEffect(() => {
    fetchProviders();
    // Load saved settings
    const saved = localStorage.getItem("synapsis-settings");
    if (saved) {
      const settings = JSON.parse(saved);
      setSelectedProvider(settings.provider || "ollama");
      setSelectedModel(settings.model || "");
      setFontSize(settings.fontSize || 14);
      setTheme(settings.theme || "dark");
      setAutoSave(settings.autoSave || "afterDelay");
    }
  }, []);

  const fetchProviders = async () => {
    try {
      const response = await fetch("/api/providers");
      const data = await response.json();
      setProviders(data.providers);
    } catch (error) {
      console.error("Failed to fetch providers:", error);
    }
  };

  const saveSettings = () => {
    const settings = {
      provider: selectedProvider,
      model: selectedModel,
      apiKey,
      fontSize,
      theme,
      autoSave,
      learningMode,
      userLevel,
    };
    localStorage.setItem("synapsis-settings", JSON.stringify(settings));
    setGlobalTheme(theme as Theme);
    addNotification("Settings saved", "success");
  };

  const currentProvider = providers.find((p) => p.id === selectedProvider);

  return (
    <div className="p-4 h-full overflow-auto">
      <div className="text-xs uppercase tracking-wider text-gray-400 mb-4">
        Settings
      </div>

      <div className="space-y-6">
        {/* AI Provider Section */}
        <div>
          <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
            🧠 AI Provider
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-400 block mb-1">
                Provider
              </label>
              <select
                value={selectedProvider}
                onChange={(e) => {
                  setSelectedProvider(e.target.value);
                  const p = providers.find((p) => p.id === e.target.value);
                  if (p?.models.length) setSelectedModel(p.models[0]);
                }}
                className="w-full bg-[#3c3c3c] text-white rounded px-3 py-2 text-sm outline-none"
              >
                {providers.map((p) => (
                  <option key={p.id} value={p.id} disabled={!p.available}>
                    {p.name} {!p.available && "(unavailable)"}
                  </option>
                ))}
              </select>
            </div>

            {currentProvider?.models && currentProvider.models.length > 0 && (
              <div>
                <label className="text-xs text-gray-400 block mb-1">
                  Model
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full bg-[#3c3c3c] text-white rounded px-3 py-2 text-sm outline-none"
                >
                  {currentProvider.models.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedProvider !== "ollama" && (
              <div>
                <label className="text-xs text-gray-400 block mb-1">
                  API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setInputApiKey(e.target.value)}
                  placeholder="Enter API key..."
                  className="w-full bg-[#3c3c3c] text-white rounded px-3 py-2 text-sm outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Your API key is stored locally and never sent to our servers.
                </p>
              </div>
            )}

            <div className="bg-[#1e1e1e] rounded p-2 text-xs text-gray-400">
              {selectedProvider === "ollama" ? (
                <>
                  💡 <strong>Local AI:</strong> Make sure Ollama is running:
                  <code className="block mt-1 bg-[#3c3c3c] p-1 rounded">
                    ollama serve
                  </code>
                  <code className="block mt-1 bg-[#3c3c3c] p-1 rounded">
                    ollama pull llama3.2
                  </code>
                </>
              ) : (
                <>
                  💡 Get your API key from{" "}
                  {selectedProvider === "openai"
                    ? "platform.openai.com"
                    : "console.anthropic.com"}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Learning Section */}
        <div>
          <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
            🎓 Learning
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-400 block mb-1">
                Learning Mode
              </label>
              <select
                value={learningMode}
                onChange={(e) => {
                  setLearningMode(e.target.value as any);
                  addNotification(`Mode: ${e.target.value}`, "info");
                }}
                className="w-full bg-[#3c3c3c] text-white rounded px-3 py-2 text-sm outline-none"
              >
                <option value="learning">Learning (Guided)</option>
                <option value="builder">Builder (Direct)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {learningMode === "learning"
                  ? "AI will guide you through decisions and ask questions"
                  : "AI will provide direct solutions"}
              </p>
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">
                User Level
              </label>
              <select
                value={userLevel}
                onChange={(e) => {
                  setUserLevel(e.target.value as any);
                  addNotification(`Level: ${e.target.value}`, "info");
                }}
                className="w-full bg-[#3c3c3c] text-white rounded px-3 py-2 text-sm outline-none"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>

        {/* Editor Section */}
        <div>
          <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
            📝 Editor
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-400 block mb-1">
                Theme
              </label>
              <select
                value={theme}
                onChange={(e) => {
                  setTheme(e.target.value);
                  setGlobalTheme(e.target.value as Theme);
                }}
                className="w-full bg-[#3c3c3c] text-white rounded px-3 py-2 text-sm outline-none"
              >
                <option value="dark">Dark+ (default)</option>
                <option value="light">Light+</option>
                <option value="monokai">Monokai</option>
                <option value="dracula">Dracula</option>
                <option value="github-dark">GitHub Dark</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">
                Font Size
              </label>
              <input
                type="number"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                min={10}
                max={24}
                className="w-full bg-[#3c3c3c] text-white rounded px-3 py-2 text-sm outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">
                Auto Save
              </label>
              <select
                value={autoSave}
                onChange={(e) => setAutoSave(e.target.value)}
                className="w-full bg-[#3c3c3c] text-white rounded px-3 py-2 text-sm outline-none"
              >
                <option value="afterDelay">After Delay (1s)</option>
                <option value="onFocusChange">On Focus Change</option>
                <option value="onWindowChange">On Window Change</option>
                <option value="off">Off</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={saveSettings}
          className="w-full bg-blue-600 text-white rounded py-2 text-sm hover:bg-blue-700 transition-colors"
        >
          Save Settings
        </button>

        {/* Keyboard Shortcuts */}
        <div>
          <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
            ⌨️ Keyboard Shortcuts
          </h3>
          <div className="space-y-1 text-xs">
            {[
              { shortcut: "Ctrl+Shift+P", desc: "Command Palette" },
              { shortcut: "Ctrl+`", desc: "Toggle Terminal" },
              { shortcut: "Ctrl+B", desc: "Toggle Sidebar" },
              { shortcut: "Ctrl+S", desc: "Save File" },
              { shortcut: "Ctrl+N", desc: "New File" },
              { shortcut: "Ctrl+W", desc: "Close Tab" },
              { shortcut: "Ctrl+Shift+D", desc: "Dashboard" },
            ].map((item) => (
              <div
                key={item.shortcut}
                className="flex justify-between text-gray-400"
              >
                <span>{item.desc}</span>
                <span className="bg-[#3c3c3c] px-2 py-0.5 rounded font-mono">
                  {item.shortcut}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
