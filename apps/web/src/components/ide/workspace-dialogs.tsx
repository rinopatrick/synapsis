"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface NewWorkspaceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}

export function NewWorkspaceDialog({ isOpen, onClose, onCreate }: NewWorkspaceDialogProps) {
  const [name, setName] = useState("");

  if (!isOpen) return null;

  const handleCreate = () => {
    if (name.trim()) {
      onCreate(name.trim());
      setName("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-[#252526] rounded-lg shadow-2xl border border-[#3c3c3c] w-[400px]">
        <div className="p-4 border-b border-[#3c3c3c]">
          <h2 className="text-lg font-medium text-white">New Workspace</h2>
        </div>
        <div className="p-4">
          <label className="text-sm text-gray-400 block mb-2">Workspace Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            placeholder="my-project"
            className="w-full bg-[#3c3c3c] text-white rounded px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
            autoFocus
          />
        </div>
        <div className="p-4 border-t border-[#3c3c3c] flex justify-end gap-2">
          <button
            className="px-4 py-2 text-sm text-gray-400 hover:text-white"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            onClick={handleCreate}
            disabled={!name.trim()}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

interface OpenWorkspaceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: (workspace: any) => void;
  workspaces: any[];
}

export function OpenWorkspaceDialog({ isOpen, onClose, onOpen, workspaces }: OpenWorkspaceDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-[#252526] rounded-lg shadow-2xl border border-[#3c3c3c] w-[500px]">
        <div className="p-4 border-b border-[#3c3c3c]">
          <h2 className="text-lg font-medium text-white">Open Workspace</h2>
        </div>
        <div className="p-4 max-h-[400px] overflow-auto">
          {workspaces.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No saved workspaces
            </div>
          ) : (
            <div className="space-y-2">
              {workspaces.map((workspace) => (
                <div
                  key={workspace.id}
                  className="flex items-center justify-between p-3 bg-[#1e1e1e] rounded border border-[#3c3c3c] hover:border-blue-500 cursor-pointer"
                  onClick={() => { onOpen(workspace); onClose(); }}
                >
                  <div>
                    <div className="text-sm text-white">{workspace.name}</div>
                    <div className="text-xs text-gray-500">{workspace.path}</div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(workspace.lastOpened).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="p-4 border-t border-[#3c3c3c] flex justify-end">
          <button
            className="px-4 py-2 text-sm text-gray-400 hover:text-white"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

interface NewFileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}

export function NewFileDialog({ isOpen, onClose, onCreate }: NewFileDialogProps) {
  const [name, setName] = useState("");

  if (!isOpen) return null;

  const handleCreate = () => {
    if (name.trim()) {
      onCreate(name.trim());
      setName("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-[#252526] rounded-lg shadow-2xl border border-[#3c3c3c] w-[400px]">
        <div className="p-4 border-b border-[#3c3c3c]">
          <h2 className="text-lg font-medium text-white">New File</h2>
        </div>
        <div className="p-4">
          <label className="text-sm text-gray-400 block mb-2">File Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            placeholder="component.tsx"
            className="w-full bg-[#3c3c3c] text-white rounded px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
            autoFocus
          />
          <div className="mt-2 text-xs text-gray-500">
            Templates: .tsx, .ts, .js, .jsx, .json, .css, .html, .md, .py
          </div>
        </div>
        <div className="p-4 border-t border-[#3c3c3c] flex justify-end gap-2">
          <button
            className="px-4 py-2 text-sm text-gray-400 hover:text-white"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            onClick={handleCreate}
            disabled={!name.trim()}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
