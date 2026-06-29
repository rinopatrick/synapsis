"use client";

import { useState, useCallback } from "react";
import { useDebug } from "@/hooks/use-debug";
import { useIDEStore } from "@/hooks/use-ide-store";

export function DebugPanel() {
  const { activeFile, openFiles, addNotification } = useIDEStore();
  const {
    sessionId,
    isRunning,
    currentFile,
    currentLine,
    variables,
    callStack,
    breakpoints,
    evaluateExpression,
    evaluateResult,
    startDebug,
    stopDebug,
    continue: continueDebug,
    stepOver,
    stepInto,
    stepOut,
    evaluate,
    setEvaluateExpression,
    toggleBreakpoint,
    removeBreakpoint,
  } = useDebug();

  const [localExpression, setLocalExpression] = useState("");

  const handleStartDebug = useCallback(async () => {
    const file = currentFile || activeFile;
    if (!file) {
      addNotification("No file selected for debugging", "error");
      return;
    }
    const openFile = openFiles.find((f) => f.id === file);
    if (!openFile) {
      addNotification("File not found", "error");
      return;
    }
    await startDebug(openFile.path);
    addNotification("Debug session started", "info");
  }, [currentFile, activeFile, openFiles, startDebug, addNotification]);

  const handleStopDebug = useCallback(async () => {
    await stopDebug();
    addNotification("Debug session stopped", "info");
  }, [stopDebug, addNotification]);

  const handleEvaluate = useCallback(async () => {
    if (!localExpression.trim()) return;
    await evaluate(localExpression);
  }, [localExpression, evaluate]);

  const handleEvaluateKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleEvaluate();
      }
    },
    [handleEvaluate]
  );

  const allBreakpoints: Array<{ file: string; line: number }> = [];
  breakpoints.forEach((lines, file) => {
    lines.forEach((line) => allBreakpoints.push({ file, line }));
  });

  return (
    <div className="h-full flex flex-col bg-[#252526] text-gray-300">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#3c3c3c]">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Run and Debug</span>
          {sessionId && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-blue-600/20 text-blue-400">
              {isRunning ? "Running" : "Paused"}
            </span>
          )}
        </div>
        {sessionId ? (
          <button
            onClick={handleStopDebug}
            className="p-1 hover:bg-[#3c3c3c] rounded text-red-400 hover:text-red-300"
            title="Stop debugging"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4 2h8v12H4V2z" />
            </svg>
          </button>
        ) : (
          <button
            onClick={handleStartDebug}
            className="p-1 hover:bg-[#3c3c3c] rounded text-green-400 hover:text-green-300"
            title="Start debugging"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4 2l10 6-10 6V2z" />
            </svg>
          </button>
        )}
      </div>

      {/* Debug Controls */}
      {sessionId && (
        <div className="flex items-center justify-center gap-1 px-3 py-2 border-b border-[#3c3c3c]">
          <button
            onClick={() => continueDebug()}
            className="p-1.5 hover:bg-[#3c3c3c] rounded text-gray-400 hover:text-white"
            title="Continue (F5)"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4 2l10 6-10 6V2z" />
            </svg>
          </button>
          <button
            onClick={() => stepOver()}
            className="p-1.5 hover:bg-[#3c3c3c] rounded text-gray-400 hover:text-white"
            title="Step Over (F10)"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M2 8h12M8 2v6l4 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
          <button
            onClick={() => stepInto()}
            className="p-1.5 hover:bg-[#3c3c3c] rounded text-gray-400 hover:text-white"
            title="Step Into (F11)"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 2v12M4 8l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
          <button
            onClick={() => stepOut()}
            className="p-1.5 hover:bg-[#3c3c3c] rounded text-gray-400 hover:text-white"
            title="Step Out (Shift+F11)"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 14V2M4 6l4-4 4 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
          <button
            onClick={handleStopDebug}
            className="p-1.5 hover:bg-[#3c3c3c] rounded text-red-400 hover:text-red-300 ml-2"
            title="Stop (Shift+F5)"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <rect x="3" y="3" width="10" height="10" rx="1" />
            </svg>
          </button>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Current Location */}
        {currentFile && currentLine && (
          <div className="px-3 py-2 border-b border-[#3c3c3c]">
            <div className="text-xs text-gray-500 mb-1">Current Location</div>
            <div className="text-sm text-blue-400">
              {currentFile.split("/").pop()}:{currentLine}
            </div>
          </div>
        )}

        {/* Variables */}
        {sessionId && (
          <div className="border-b border-[#3c3c3c]">
            <div className="flex items-center px-3 py-1.5 bg-[#2d2d2d] cursor-pointer">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" className="mr-1 text-gray-500">
                <path d="M6 4l4 4-4 4" />
              </svg>
              <span className="text-xs font-medium text-gray-400">Variables</span>
            </div>
            <div className="px-3 py-1">
              {Object.keys(variables).length === 0 ? (
                <div className="text-xs text-gray-500 py-1">No variables available</div>
              ) : (
                Object.entries(variables).map(([name, value]) => (
                  <div key={name} className="flex items-center py-0.5 text-xs">
                    <span className="text-yellow-300 mr-2">{name}</span>
                    <span className="text-gray-400">=</span>
                    <span className="text-green-400 ml-2">{String(value)}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Call Stack */}
        {sessionId && (
          <div className="border-b border-[#3c3c3c]">
            <div className="flex items-center px-3 py-1.5 bg-[#2d2d2d] cursor-pointer">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" className="mr-1 text-gray-500">
                <path d="M6 4l4 4-4 4" />
              </svg>
              <span className="text-xs font-medium text-gray-400">Call Stack</span>
            </div>
            <div className="px-3 py-1">
              {callStack.length === 0 ? (
                <div className="text-xs text-gray-500 py-1">No call stack</div>
              ) : (
                callStack.map((frame, index) => (
                  <div
                    key={index}
                    className="flex items-center py-0.5 text-xs cursor-pointer hover:bg-[#3c3c3c] px-1 rounded"
                  >
                    <span className="text-gray-300">{frame}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Breakpoints */}
        <div className="border-b border-[#3c3c3c]">
          <div className="flex items-center px-3 py-1.5 bg-[#2d2d2d] cursor-pointer">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" className="mr-1 text-gray-500">
              <path d="M6 4l4 4-4 4" />
            </svg>
            <span className="text-xs font-medium text-gray-400">Breakpoints</span>
          </div>
          <div className="px-3 py-1">
            {allBreakpoints.length === 0 ? (
              <div className="text-xs text-gray-500 py-1">No breakpoints set</div>
            ) : (
              allBreakpoints.map(({ file, line }) => (
                <div
                  key={`${file}-${line}`}
                  className="flex items-center justify-between py-0.5 text-xs group"
                >
                  <div className="flex items-center min-w-0">
                    <span className="w-2 h-2 rounded-full bg-red-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-300 truncate">
                      {file.split("/").pop()}:{line}
                    </span>
                  </div>
                  <button
                    onClick={() => removeBreakpoint(file, line)}
                    className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-[#3c3c3c] rounded text-gray-500 hover:text-red-400"
                    title="Remove breakpoint"
                  >
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 8.707l3.646 3.647.708-.707L8.707 8l3.647-3.646-.708-.708L8 7.293 4.354 3.646l-.708.708L7.293 8l-3.647 3.646.708.708L8 8.707z" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Evaluate Expression */}
        {sessionId && (
          <div className="border-b border-[#3c3c3c]">
            <div className="flex items-center px-3 py-1.5 bg-[#2d2d2d] cursor-pointer">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" className="mr-1 text-gray-500">
                <path d="M6 4l4 4-4 4" />
              </svg>
              <span className="text-xs font-medium text-gray-400">Watch</span>
            </div>
            <div className="px-3 py-2">
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={localExpression}
                  onChange={(e) => setLocalExpression(e.target.value)}
                  onKeyDown={handleEvaluateKeyDown}
                  placeholder="Enter expression..."
                  className="flex-1 bg-[#3c3c3c] text-sm text-gray-300 px-2 py-1 rounded border border-[#555] focus:border-blue-500 focus:outline-none"
                />
                <button
                  onClick={handleEvaluate}
                  className="p-1 hover:bg-[#3c3c3c] rounded text-gray-400 hover:text-white"
                  title="Evaluate"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M4 2l10 6-10 6V2z" />
                  </svg>
                </button>
              </div>
              {evaluateResult && (
                <div className="mt-1 text-xs text-green-400 px-1">{evaluateResult}</div>
              )}
            </div>
          </div>
        )}

        {/* Launch Configuration */}
        {!sessionId && (
          <div className="px-3 py-4">
            <div className="text-center">
              <div className="text-3xl mb-3">🐛</div>
              <div className="text-sm text-gray-400 mb-2">Debug your code</div>
              <div className="text-xs text-gray-500 mb-4">
                Select a file and click the play button to start debugging
              </div>
              <button
                onClick={handleStartDebug}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
              >
                Start Debugging
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
