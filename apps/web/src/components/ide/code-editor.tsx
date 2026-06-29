"use client";

import { useCallback } from "react";
import Editor, { OnMount, OnChange } from "@monaco-editor/react";
import { cn } from "@/lib/utils";
import { useIDEStore } from "@/hooks/use-ide-store";

const fileIcons: Record<string, string> = {
  tsx: "⚛️",
  ts: "📘",
  js: "📒",
  jsx: "⚛️",
  json: "📋",
  css: "🎨",
  html: "🌐",
  md: "📝",
};

function getFileIcon(name: string): string {
  const ext = name.split(".").pop() || "";
  return fileIcons[ext] || "📄";
}

function getLanguage(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  const langMap: Record<string, string> = {
    ts: "typescript",
    tsx: "typescript",
    js: "javascript",
    jsx: "javascript",
    json: "json",
    css: "css",
    html: "html",
    md: "markdown",
    py: "python",
    rs: "rust",
    go: "go",
  };
  return langMap[ext] || "plaintext";
}

export function CodeEditor() {
  const { activeFile, openFiles, setActiveFile, closeFile, updateFileContent } = useIDEStore();

  const currentFile = openFiles.find((f) => f.id === activeFile);

  const handleEditorChange: OnChange = useCallback(
    (value) => {
      if (value !== undefined && activeFile) {
        updateFileContent(activeFile, value);
      }
    },
    [activeFile, updateFileContent]
  );

  const handleEditorMount: OnMount = useCallback((editor, monaco) => {
    monaco.editor.defineTheme("synapsis-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "6A9955", fontStyle: "italic" },
        { token: "keyword", foreground: "C586C0" },
        { token: "string", foreground: "CE9178" },
        { token: "number", foreground: "B5CEA8" },
        { token: "type", foreground: "4EC9B0" },
        { token: "class", foreground: "4EC9B0" },
        { token: "function", foreground: "DCDCAA" },
        { token: "variable", foreground: "9CDCFE" },
        { token: "constant", foreground: "4FC1FF" },
      ],
      colors: {
        "editor.background": "#1e1e1e",
        "editor.foreground": "#d4d4d4",
        "editorLineNumber.foreground": "#858585",
        "editorLineNumber.activeForeground": "#c6c6c6",
        "editor.lineHighlightBackground": "#2a2d2e",
        "editorCursor.foreground": "#aeafad",
        "editor.selectionBackground": "#264f78",
        "editor.inactiveSelectionBackground": "#3a3d41",
      },
    });
    monaco.editor.setTheme("synapsis-dark");
  }, []);

  const pathParts = currentFile?.path.split("/") || [];

  return (
    <div className="h-full bg-[#1e1e1e] flex flex-col">
      {/* Tabs */}
      <div className="flex bg-[#252526] border-b border-[#3c3c3c] overflow-x-auto">
        {openFiles.map((file) => (
          <div
            key={file.id}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 text-sm cursor-pointer border-r border-[#3c3c3c] min-w-0 group",
              activeFile === file.id
                ? "bg-[#1e1e1e] text-white"
                : "bg-[#2d2d2d] text-gray-400 hover:text-gray-200"
            )}
            onClick={() => setActiveFile(file.id)}
          >
            <span>{getFileIcon(file.name)}</span>
            <span className="truncate">{file.name}</span>
            {file.modified && (
              <span className="w-2 h-2 rounded-full bg-orange-400 ml-1" />
            )}
            <button
              className="ml-1 opacity-0 group-hover:opacity-100 hover:text-white text-xs px-1"
              onClick={(e) => {
                e.stopPropagation();
                closeFile(file.id);
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Breadcrumb */}
      {currentFile && (
        <div className="bg-[#1e1e1e] px-4 py-1 text-xs text-gray-500 border-b border-[#2d2d2d] flex items-center">
          {pathParts.map((part, index) => (
            <div key={index} className="flex items-center">
              {index > 0 && <span className="mx-1 text-gray-600">›</span>}
              <span className={cn(index === pathParts.length - 1 ? "text-gray-300" : "text-gray-500")}>
                {part}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Monaco Editor */}
      <div className="flex-1 overflow-hidden">
        {currentFile ? (
          <Editor
            height="100%"
            language={getLanguage(currentFile.name)}
            value={currentFile.content}
            onChange={handleEditorChange}
            onMount={handleEditorMount}
            theme="synapsis-dark"
            options={{
              fontSize: 14,
              fontFamily: "'Fira Code', 'Cascadia Code', 'JetBrains Mono', monospace",
              fontLigatures: true,
              minimap: { enabled: true, scale: 1 },
              scrollBeyondLastLine: false,
              wordWrap: "on",
              lineNumbers: "on",
              renderLineHighlight: "all",
              bracketPairColorization: { enabled: true },
              guides: { bracketPairs: true, indentation: true },
              padding: { top: 10, bottom: 10 },
              smoothScrolling: true,
              cursorBlinking: "smooth",
              cursorSmoothCaretAnimation: "on",
              renderWhitespace: "selection",
              tabSize: 2,
              insertSpaces: true,
              autoClosingBrackets: "always",
              autoClosingQuotes: "always",
              formatOnPaste: true,
              formatOnType: true,
              suggestOnTriggerCharacters: true,
              quickSuggestions: true,
              parameterHints: { enabled: true },
            }}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-2">📄</div>
              <div>No file open</div>
              <div className="text-sm mt-1">Select a file from the explorer</div>
            </div>
          </div>
        )}
      </div>

      {/* Status bar */}
      {currentFile && (
        <div className="bg-[#007acc] px-3 py-0.5 text-xs text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span>main</span>
            <span>✓ 0</span>
            <span>⚠ 0</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Spaces: 2</span>
            <span>UTF-8</span>
            <span>{getLanguage(currentFile.name)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
