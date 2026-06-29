"use client";

import { useCallback } from "react";
import Editor, { OnMount, OnChange } from "@monaco-editor/react";
import { cn } from "@/lib/utils";
import { useIDEStore } from "@/hooks/use-ide-store";
import { useMultiEditor } from "@/hooks/use-multi-editor";

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

const editorOptions = {
  fontSize: 14,
  fontFamily: "'Fira Code', 'Cascadia Code', 'JetBrains Mono', monospace",
  fontLigatures: true,
  minimap: { enabled: true, scale: 1 },
  scrollBeyondLastLine: false,
  wordWrap: "on" as const,
  lineNumbers: "on" as const,
  renderLineHighlight: "all" as const,
  bracketPairColorization: { enabled: true },
  guides: { bracketPairs: true, indentation: true },
  padding: { top: 10, bottom: 10 },
  smoothScrolling: true,
  cursorBlinking: "smooth" as const,
  cursorSmoothCaretAnimation: "on" as const,
  renderWhitespace: "selection" as const,
  tabSize: 2,
  insertSpaces: true,
  autoClosingBrackets: "always" as const,
  autoClosingQuotes: "always" as const,
  formatOnPaste: true,
  formatOnType: true,
  suggestOnTriggerCharacters: true,
  quickSuggestions: true,
  parameterHints: { enabled: true },
};

interface CodeEditorPaneProps {
  paneId: string;
  fileId: string | null;
  isActive: boolean;
  paneCount: number;
  onActivate: () => void;
  onClose: () => void;
  onSplit: () => void;
}

function CodeEditorPane({
  paneId,
  fileId,
  isActive,
  paneCount,
  onActivate,
  onClose,
  onSplit,
}: CodeEditorPaneProps) {
  const { openFiles, updateFileContent, setActiveFile } = useIDEStore();
  const { setPaneFile } = useMultiEditor();

  const currentFile = openFiles.find((f) => f.id === fileId);

  const handleEditorChange: OnChange = useCallback(
    (value) => {
      if (value !== undefined && fileId) {
        updateFileContent(fileId, value);
      }
    },
    [fileId, updateFileContent]
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
    <div
      className={cn(
        "h-full flex flex-col bg-[#1e1e1e]",
        isActive && "ring-1 ring-blue-500/50"
      )}
      onClick={onActivate}
    >
      {/* Pane Header */}
      <div className="flex items-center justify-between bg-[#252526] px-2 py-1 border-b border-[#3c3c3c]">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {currentFile ? (
            <>
              <span>{getFileIcon(currentFile.name)}</span>
              <span className="text-sm text-gray-300 truncate">
                {currentFile.name}
              </span>
              {currentFile.modified && (
                <span className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />
              )}
            </>
          ) : (
            <span className="text-sm text-gray-500">No file</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            className="p-1 hover:bg-[#3c3c3c] rounded text-gray-400 hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              onSplit();
            }}
            title="Split pane"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <path d="M8 1v14M1h6v14H1V1h7zM9 1h6v14H9V1z" opacity="0.5" />
              <path d="M8 1v14" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
          {paneCount > 1 && (
            <button
              className="p-1 hover:bg-[#3c3c3c] rounded text-gray-400 hover:text-white"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              title="Close pane"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M8 8.707l3.646 3.647.708-.707L8.707 8l3.647-3.646-.708-.708L8 7.293 4.354 3.646l-.708.708L7.293 8l-3.647 3.646.708.708L8 8.707z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* File Tabs */}
      <div className="flex bg-[#2d2d2d] border-b border-[#3c3c3c] overflow-x-auto">
        {openFiles.map((file) => (
          <div
            key={file.id}
            className={cn(
              "flex items-center gap-1 px-2 py-1 text-xs cursor-pointer border-r border-[#3c3c3c] min-w-0 group",
              fileId === file.id
                ? "bg-[#1e1e1e] text-white"
                : "text-gray-400 hover:text-gray-200"
            )}
            onClick={(e) => {
              e.stopPropagation();
              setPaneFile(paneId, file.id);
              setActiveFile(file.id);
            }}
          >
            <span className="text-xs">{getFileIcon(file.name)}</span>
            <span className="truncate">{file.name}</span>
            {file.modified && (
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
            )}
          </div>
        ))}
      </div>

      {/* Breadcrumb */}
      {currentFile && (
        <div className="bg-[#1e1e1e] px-3 py-0.5 text-xs text-gray-500 border-b border-[#2d2d2d] flex items-center">
          {pathParts.map((part, index) => (
            <div key={index} className="flex items-center">
              {index > 0 && <span className="mx-1 text-gray-600">›</span>}
              <span
                className={cn(
                  index === pathParts.length - 1
                    ? "text-gray-300"
                    : "text-gray-500"
                )}
              >
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
            options={editorOptions}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-3xl mb-2">📄</div>
              <div className="text-sm">Select a file to edit</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function CodeEditor() {
  const { activeFile, openFiles } = useIDEStore();
  const {
    panes,
    activePaneId,
    splitDirection,
    setActivePane,
    closePane,
    splitPane,
    setSplitDirection,
    createPane,
    setPaneFile,
  } = useMultiEditor();

  const handleSplit = useCallback(
    (paneId: string) => {
      splitPane(paneId);
    },
    [splitPane]
  );

  const handleClosePane = useCallback(
    (paneId: string) => {
      closePane(paneId);
    },
    [closePane]
  );

  const handleActivatePane = useCallback(
    (paneId: string) => {
      setActivePane(paneId);
    },
    [setActivePane]
  );

  const handleToggleDirection = useCallback(() => {
    setSplitDirection(splitDirection === "vertical" ? "horizontal" : "vertical");
  }, [splitDirection, setSplitDirection]);

  const pathParts = openFiles.find((f) => f.id === activeFile)?.path.split("/") || [];

  return (
    <div className="h-full bg-[#1e1e1e] flex flex-col">
      {/* Editor Header with Split Controls */}
      <div className="flex items-center justify-between bg-[#252526] px-3 py-1.5 border-b border-[#3c3c3c]">
        <div className="flex items-center gap-3">
          {/* Breadcrumb */}
          {activeFile && (
            <div className="text-xs text-gray-500 flex items-center">
              {pathParts.map((part, index) => (
                <div key={index} className="flex items-center">
                  {index > 0 && <span className="mx-1 text-gray-600">›</span>}
                  <span
                    className={cn(
                      index === pathParts.length - 1
                        ? "text-gray-300"
                        : "text-gray-500"
                    )}
                  >
                    {part}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Split View Controls */}
        <div className="flex items-center gap-1">
          <button
            className={cn(
              "px-2 py-1 text-xs rounded hover:bg-[#3c3c3c]",
              splitDirection === "vertical"
                ? "text-blue-400 bg-[#3c3c3c]"
                : "text-gray-400"
            )}
            onClick={handleToggleDirection}
            title={
              splitDirection === "vertical"
                ? "Switch to horizontal split"
                : "Switch to vertical split"
            }
          >
            {splitDirection === "vertical" ? "⬌" : "⬍"}
          </button>
          <button
            className="px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-[#3c3c3c] rounded"
            onClick={() => {
              const activePane = panes.find((p) => p.id === activePaneId);
              if (activePane) {
                splitPane(activePane.id);
              }
            }}
            title="Split editor"
          >
            Split
          </button>
        </div>
      </div>

      {/* Editor Panes */}
      <div
        className={cn(
          "flex-1 flex overflow-hidden",
          splitDirection === "vertical" ? "flex-row" : "flex-col"
        )}
      >
        {panes.map((pane) => (
          <div
            key={pane.id}
            className={cn(
              "flex-1 min-w-0 min-h-0",
              panes.indexOf(pane) > 0 &&
                (splitDirection === "vertical"
                  ? "border-l border-[#3c3c3c]"
                  : "border-t border-[#3c3c3c]")
            )}
          >
            <CodeEditorPane
              paneId={pane.id}
              fileId={pane.fileId || activeFile}
              isActive={pane.id === activePaneId}
              paneCount={panes.length}
              onActivate={() => handleActivatePane(pane.id)}
              onClose={() => handleClosePane(pane.id)}
              onSplit={() => handleSplit(pane.id)}
            />
          </div>
        ))}
      </div>

      {/* Status Bar */}
      {activeFile && (
        <div className="bg-[#007acc] px-3 py-0.5 text-xs text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span>
              {panes.length > 1
                ? `${panes.length} panes`
                : "main"}
            </span>
            <span>✓ 0</span>
            <span>⚠ 0</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Spaces: 2</span>
            <span>UTF-8</span>
            <span>
              {getLanguage(
                openFiles.find((f) => f.id === activeFile)?.name || ""
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
