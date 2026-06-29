"use client";

import { useState, useEffect } from "react";
import { useExtensions } from "@/hooks/use-extensions";
import { codeFormatterExtension } from "@/extensions/code-formatter";
import type { Extension } from "@synapsis/core";

export function ExtensionsPanel() {
  const {
    extensions,
    activeExtensions,
    registerExtension,
    enableExtension,
    disableExtension,
    unregisterExtension,
  } = useExtensions();

  const [search, setSearch] = useState("");
  const [selectedExt, setSelectedExt] = useState<Extension | null>(null);

  useEffect(() => {
    if (extensions.length === 0) {
      registerExtension(codeFormatterExtension);
    }
  }, []);

  const filtered = extensions.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col text-[#cccccc] text-sm">
      <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[#bbbbbb]">
        Extensions
      </div>

      <div className="px-3 pb-2">
        <input
          type="text"
          placeholder="Search extensions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#3c3c3c] border border-[#3c3c3c] rounded px-2 py-1 text-xs text-[#cccccc] placeholder:text-[#808080] focus:outline-none focus:border-[#007acc]"
        />
      </div>

      {selectedExt ? (
        <div className="flex-1 overflow-auto px-3">
          <button
            onClick={() => setSelectedExt(null)}
            className="text-[#007acc] text-xs mb-3 hover:underline"
          >
            ← Back to list
          </button>
          <div className="mb-3">
            <div className="text-base font-medium">{selectedExt.name}</div>
            <div className="text-[#808080] text-xs mt-1">
              v{selectedExt.version} by {selectedExt.author}
            </div>
          </div>
          <p className="text-[#cccccc] text-xs mb-4 leading-relaxed">
            {selectedExt.description}
          </p>
          <div className="flex gap-2">
            {activeExtensions.has(selectedExt.id) ? (
              <button
                onClick={() => disableExtension(selectedExt.id)}
                className="px-3 py-1 bg-[#4d4d4d] hover:bg-[#5a5a5a] rounded text-xs transition-colors"
              >
                Disable
              </button>
            ) : (
              <button
                onClick={() => enableExtension(selectedExt.id)}
                className="px-3 py-1 bg-[#007acc] hover:bg-[#1a8ad4] rounded text-xs transition-colors"
              >
                Enable
              </button>
            )}
            <button
              onClick={() => {
                unregisterExtension(selectedExt.id);
                setSelectedExt(null);
              }}
              className="px-3 py-1 bg-[#4d4d4d] hover:bg-[#5a5a5a] rounded text-xs transition-colors text-[#f48771]"
            >
              Uninstall
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
          {filtered.length === 0 ? (
            <div className="px-3 py-6 text-center text-[#808080] text-xs">
              {search ? "No extensions match your search." : "No extensions installed."}
            </div>
          ) : (
            filtered.map((ext) => (
              <button
                key={ext.id}
                onClick={() => setSelectedExt(ext)}
                className="w-full px-3 py-2 flex items-start gap-3 hover:bg-[#2a2d2e] transition-colors text-left"
              >
                <div className="mt-0.5 w-5 h-5 flex items-center justify-center shrink-0">
                  <span className="text-base">🧩</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-xs truncate">{ext.name}</span>
                    <span className="text-[10px] text-[#808080]">v{ext.version}</span>
                  </div>
                  <div className="text-[11px] text-[#808080] truncate">
                    {ext.description}
                  </div>
                  <div className="text-[10px] text-[#808080] mt-0.5">{ext.author}</div>
                </div>
                <div className="shrink-0 mt-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      activeExtensions.has(ext.id)
                        ? disableExtension(ext.id)
                        : enableExtension(ext.id);
                    }}
                    className={`w-8 h-4 rounded-full relative transition-colors ${
                      activeExtensions.has(ext.id) ? "bg-[#007acc]" : "bg-[#4d4d4d]"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${
                        activeExtensions.has(ext.id)
                          ? "translate-x-4"
                          : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
