"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useIDEStore } from "@/hooks/use-ide-store";

interface GitStatus {
  branch: string;
  ahead: number;
  behind: number;
  staged: GitFile[];
  unstaged: GitFile[];
  untracked: GitFile[];
}

interface GitFile {
  path: string;
  status: "modified" | "added" | "deleted" | "renamed" | "untracked";
}

export function GitPanel() {
  const [status, setStatus] = useState<GitStatus>({
    branch: "main",
    ahead: 0,
    behind: 0,
    staged: [],
    unstaged: [],
    untracked: [],
  });
  const [commitMessage, setCommitMessage] = useState("");
  const [isCommitting, setIsCommitting] = useState(false);
  const { addNotification, openFiles, activeFile } = useIDEStore();

  // Simulate git status
  useEffect(() => {
    const hasChanges = openFiles.some((f) => f.modified);
    if (hasChanges) {
      setStatus((prev) => ({
        ...prev,
        unstaged: openFiles
          .filter((f) => f.modified)
          .map((f) => ({ path: f.path, status: "modified" as const })),
      }));
    }
  }, [openFiles]);

  const handleStage = (file: GitFile) => {
    setStatus((prev) => ({
      ...prev,
      unstaged: prev.unstaged.filter((f) => f.path !== file.path),
      staged: [...prev.staged, file],
    }));
    addNotification(`Staged ${file.path}`, "info");
  };

  const handleUnstage = (file: GitFile) => {
    setStatus((prev) => ({
      ...prev,
      staged: prev.staged.filter((f) => f.path !== file.path),
      unstaged: [...prev.unstaged, file],
    }));
    addNotification(`Unstaged ${file.path}`, "info");
  };

  const handleStageAll = () => {
    setStatus((prev) => ({
      ...prev,
      staged: [...prev.staged, ...prev.unstaged, ...prev.untracked],
      unstaged: [],
      untracked: [],
    }));
    addNotification("All changes staged", "info");
  };

  const handleCommit = () => {
    if (!commitMessage.trim()) {
      addNotification("Enter commit message", "warning");
      return;
    }

    setIsCommitting(true);
    setTimeout(() => {
      setStatus((prev) => ({
        ...prev,
        staged: [],
        ahead: prev.ahead + 1,
      }));
      setCommitMessage("");
      setIsCommitting(false);
      addNotification(`Committed: ${commitMessage}`, "success");
    }, 500);
  };

  const handlePush = () => {
    addNotification("Pushing to remote...", "info");
    setTimeout(() => {
      setStatus((prev) => ({ ...prev, ahead: 0 }));
      addNotification("Pushed successfully", "success");
    }, 1000);
  };

  const handlePull = () => {
    addNotification("Pulling from remote...", "info");
    setTimeout(() => {
      setStatus((prev) => ({ ...prev, behind: 0 }));
      addNotification("Pulled successfully", "success");
    }, 1000);
  };

  const handleRefresh = () => {
    addNotification("Refreshing git status...", "info");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "modified": return "M";
      case "added": return "A";
      case "deleted": return "D";
      case "renamed": return "R";
      case "untracked": return "U";
      default: return "?";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "modified": return "text-yellow-400";
      case "added": return "text-green-400";
      case "deleted": return "text-red-400";
      case "renamed": return "text-blue-400";
      case "untracked": return "text-gray-400";
      default: return "text-gray-400";
    }
  };

  return (
    <div className="h-full bg-[#252526] flex flex-col">
      {/* Header */}
      <div className="px-4 py-2 border-b border-[#3c3c3c] flex items-center justify-between">
        <div className="text-xs uppercase tracking-wider text-gray-400">
          Source Control
        </div>
        <button
          className="text-xs text-gray-400 hover:text-white"
          onClick={handleRefresh}
        >
          🔄
        </button>
      </div>

      {/* Branch Info */}
      <div className="px-4 py-2 border-b border-[#3c3c3c]">
        <div className="flex items-center gap-2 text-sm">
          <span>🔀</span>
          <span className="text-white">{status.branch}</span>
          {status.ahead > 0 && (
            <span className="text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">
              ↑{status.ahead}
            </span>
          )}
          {status.behind > 0 && (
            <span className="text-xs bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded">
              ↓{status.behind}
            </span>
          )}
        </div>
        <div className="flex gap-2 mt-2">
          <button
            className="flex-1 text-xs px-2 py-1 rounded bg-[#3c3c3c] text-gray-300 hover:bg-[#4c4c4c]"
            onClick={handlePush}
            disabled={status.ahead === 0}
          >
            ↑ Push
          </button>
          <button
            className="flex-1 text-xs px-2 py-1 rounded bg-[#3c3c3c] text-gray-300 hover:bg-[#4c4c4c]"
            onClick={handlePull}
            disabled={status.behind === 0}
          >
            ↓ Pull
          </button>
        </div>
      </div>

      {/* Commit Input */}
      <div className="p-3 border-b border-[#3c3c3c]">
        <input
          type="text"
          value={commitMessage}
          onChange={(e) => setCommitMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCommit()}
          placeholder="Commit message..."
          className="w-full bg-[#3c3c3c] text-white rounded px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
        />
        <div className="flex gap-2 mt-2">
          <button
            className="flex-1 text-xs px-3 py-1.5 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
            onClick={handleCommit}
            disabled={!commitMessage.trim() || isCommitting || status.staged.length === 0}
          >
            {isCommitting ? "Committing..." : `Commit (${status.staged.length})`}
          </button>
          <button
            className="text-xs px-3 py-1.5 rounded bg-[#3c3c3c] text-gray-300 hover:bg-[#4c4c4c]"
            onClick={handleStageAll}
            disabled={status.unstaged.length === 0 && status.untracked.length === 0}
          >
            +All
          </button>
        </div>
      </div>

      {/* File Lists */}
      <div className="flex-1 overflow-auto">
        {/* Staged Changes */}
        {status.staged.length > 0 && (
          <div>
            <div className="px-4 py-1.5 text-xs text-gray-400 uppercase tracking-wider bg-[#1e1e1e]">
              Staged Changes ({status.staged.length})
            </div>
            {status.staged.map((file) => (
              <div
                key={file.path}
                className="flex items-center gap-2 px-4 py-1 hover:bg-[#2a2d2e] cursor-pointer"
              >
                <span className={cn("text-xs font-mono w-4", getStatusColor(file.status))}>
                  {getStatusIcon(file.status)}
                </span>
                <span className="text-sm text-gray-200 flex-1 truncate">
                  {file.path}
                </span>
                <button
                  className="text-xs text-gray-500 hover:text-white"
                  onClick={() => handleUnstage(file)}
                >
                  −
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Unstaged Changes */}
        {status.unstaged.length > 0 && (
          <div>
            <div className="px-4 py-1.5 text-xs text-gray-400 uppercase tracking-wider bg-[#1e1e1e]">
              Changes ({status.unstaged.length})
            </div>
            {status.unstaged.map((file) => (
              <div
                key={file.path}
                className="flex items-center gap-2 px-4 py-1 hover:bg-[#2a2d2e] cursor-pointer"
              >
                <span className={cn("text-xs font-mono w-4", getStatusColor(file.status))}>
                  {getStatusIcon(file.status)}
                </span>
                <span className="text-sm text-gray-200 flex-1 truncate">
                  {file.path}
                </span>
                <button
                  className="text-xs text-gray-500 hover:text-white"
                  onClick={() => handleStage(file)}
                >
                  +
                </button>
              </div>
            ))}
          </div>
        )}

        {/* No Changes */}
        {status.staged.length === 0 && status.unstaged.length === 0 && status.untracked.length === 0 && (
          <div className="flex items-center justify-center h-32 text-gray-500 text-sm">
            <div className="text-center">
              <span className="text-2xl">✓</span>
              <div className="mt-1">No changes</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
