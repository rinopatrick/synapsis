"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useIDEStore } from "@/hooks/use-ide-store";
import { useGit } from "@/hooks/use-git";

export function GitPanel() {
  const { files, branch, commits, isLoading, stageFiles, commit, push, pull, refresh } =
    useGit();
  const [commitMessage, setCommitMessage] = useState("");
  const [isCommitting, setIsCommitting] = useState(false);
  const [showLog, setShowLog] = useState(false);
  const { addNotification } = useIDEStore();

  const staged = files.filter((f) => /^[MADRC]/.test(f.status));
  const unstaged = files.filter((f) => /^.[MDRC]/.test(f.status));
  const untracked = files.filter((f) => f.status === "??");

  const handleStage = async (path: string) => {
    await stageFiles([path]);
    addNotification(`Staged ${path}`, "info");
  };

  const handleUnstage = async (path: string) => {
    await stageFiles(["--", path]);
    addNotification(`Unstaged ${path}`, "info");
  };

  const handleStageAll = async () => {
    await stageFiles(["."]);
    addNotification("All changes staged", "info");
  };

  const handleCommit = async () => {
    if (!commitMessage.trim()) {
      addNotification("Enter commit message", "warning");
      return;
    }

    setIsCommitting(true);
    try {
      await commit(commitMessage);
      setCommitMessage("");
      addNotification("Committed successfully", "success");
    } catch {
      addNotification("Commit failed", "error");
    } finally {
      setIsCommitting(false);
    }
  };

  const handlePush = async () => {
    addNotification("Pushing to remote...", "info");
    try {
      await push();
      addNotification("Pushed successfully", "success");
    } catch {
      addNotification("Push failed", "error");
    }
  };

  const handlePull = async () => {
    addNotification("Pulling from remote...", "info");
    try {
      await pull();
      addNotification("Pulled successfully", "success");
    } catch {
      addNotification("Pull failed", "error");
    }
  };

  const getStatusIcon = (status: string) => {
    const s = status.trim();
    switch (s) {
      case "M":
        return "M";
      case "A":
        return "A";
      case "D":
        return "D";
      case "R":
        return "R";
      case "??":
        return "U";
      default:
        return s || "?";
    }
  };

  const getStatusColor = (status: string) => {
    const s = status.trim();
    switch (s) {
      case "M":
        return "text-yellow-400";
      case "A":
        return "text-green-400";
      case "D":
        return "text-red-400";
      case "R":
        return "text-blue-400";
      case "??":
        return "text-gray-400";
      default:
        return "text-gray-400";
    }
  };

  const totalChanges = staged.length + unstaged.length + untracked.length;

  return (
    <div className="h-full bg-[#252526] flex flex-col">
      {/* Header */}
      <div className="px-4 py-2 border-b border-[#3c3c3c] flex items-center justify-between">
        <div className="text-xs uppercase tracking-wider text-gray-400">
          Source Control
        </div>
        <div className="flex items-center gap-2">
          <button
            className={cn(
              "text-xs px-2 py-0.5 rounded",
              showLog ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
            )}
            onClick={() => setShowLog(!showLog)}
          >
            Log
          </button>
          <button
            className="text-xs text-gray-400 hover:text-white"
            onClick={refresh}
            disabled={isLoading}
          >
            🔄
          </button>
        </div>
      </div>

      {/* Branch Info */}
      <div className="px-4 py-2 border-b border-[#3c3c3c]">
        <div className="flex items-center gap-2 text-sm">
          <span>🔀</span>
          <span className="text-white">{branch || "detached"}</span>
        </div>
        <div className="flex gap-2 mt-2">
          <button
            className="flex-1 text-xs px-2 py-1 rounded bg-[#3c3c3c] text-gray-300 hover:bg-[#4c4c4c] disabled:opacity-50"
            onClick={handlePush}
            disabled={isLoading}
          >
            ↑ Push
          </button>
          <button
            className="flex-1 text-xs px-2 py-1 rounded bg-[#3c3c3c] text-gray-300 hover:bg-[#4c4c4c] disabled:opacity-50"
            onClick={handlePull}
            disabled={isLoading}
          >
            ↓ Pull
          </button>
        </div>
      </div>

      {/* Commit Log */}
      {showLog && (
        <div className="border-b border-[#3c3c3c] max-h-48 overflow-auto">
          <div className="px-4 py-1.5 text-xs text-gray-400 uppercase tracking-wider bg-[#1e1e1e]">
            Commit History
          </div>
          {commits.length === 0 ? (
            <div className="px-4 py-3 text-xs text-gray-500">No commits yet</div>
          ) : (
            commits.map((c) => (
              <div
                key={c.hash}
                className="px-4 py-1.5 hover:bg-[#2a2d2e] cursor-pointer"
              >
                <div className="text-sm text-gray-200 truncate">{c.message}</div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {c.hash.substring(0, 7)} · {c.author} · {c.date}
                </div>
              </div>
            ))
          )}
        </div>
      )}

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
            disabled={!commitMessage.trim() || isCommitting || staged.length === 0}
          >
            {isCommitting ? "Committing..." : `Commit (${staged.length})`}
          </button>
          <button
            className="text-xs px-3 py-1.5 rounded bg-[#3c3c3c] text-gray-300 hover:bg-[#4c4c4c] disabled:opacity-50"
            onClick={handleStageAll}
            disabled={unstaged.length === 0 && untracked.length === 0}
          >
            +All
          </button>
        </div>
      </div>

      {/* File Lists */}
      <div className="flex-1 overflow-auto">
        {/* Staged Changes */}
        {staged.length > 0 && (
          <div>
            <div className="px-4 py-1.5 text-xs text-gray-400 uppercase tracking-wider bg-[#1e1e1e]">
              Staged Changes ({staged.length})
            </div>
            {staged.map((file) => (
              <div
                key={file.path}
                className="flex items-center gap-2 px-4 py-1 hover:bg-[#2a2d2e] cursor-pointer"
              >
                <span
                  className={cn(
                    "text-xs font-mono w-4",
                    getStatusColor(file.status)
                  )}
                >
                  {getStatusIcon(file.status)}
                </span>
                <span className="text-sm text-gray-200 flex-1 truncate">
                  {file.path}
                </span>
                <button
                  className="text-xs text-gray-500 hover:text-white"
                  onClick={() => handleUnstage(file.path)}
                >
                  −
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Unstaged Changes */}
        {unstaged.length > 0 && (
          <div>
            <div className="px-4 py-1.5 text-xs text-gray-400 uppercase tracking-wider bg-[#1e1e1e]">
              Changes ({unstaged.length})
            </div>
            {unstaged.map((file) => (
              <div
                key={file.path}
                className="flex items-center gap-2 px-4 py-1 hover:bg-[#2a2d2e] cursor-pointer"
              >
                <span
                  className={cn(
                    "text-xs font-mono w-4",
                    getStatusColor(file.status)
                  )}
                >
                  {getStatusIcon(file.status)}
                </span>
                <span className="text-sm text-gray-200 flex-1 truncate">
                  {file.path}
                </span>
                <button
                  className="text-xs text-gray-500 hover:text-white"
                  onClick={() => handleStage(file.path)}
                >
                  +
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Untracked Files */}
        {untracked.length > 0 && (
          <div>
            <div className="px-4 py-1.5 text-xs text-gray-400 uppercase tracking-wider bg-[#1e1e1e]">
              Untracked ({untracked.length})
            </div>
            {untracked.map((file) => (
              <div
                key={file.path}
                className="flex items-center gap-2 px-4 py-1 hover:bg-[#2a2d2e] cursor-pointer"
              >
                <span className="text-xs font-mono w-4 text-gray-400">U</span>
                <span className="text-sm text-gray-200 flex-1 truncate">
                  {file.path}
                </span>
                <button
                  className="text-xs text-gray-500 hover:text-white"
                  onClick={() => handleStage(file.path)}
                >
                  +
                </button>
              </div>
            ))}
          </div>
        )}

        {/* No Changes */}
        {totalChanges === 0 && (
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
