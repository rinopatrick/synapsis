"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useIDEStore } from "@/hooks/use-ide-store";

interface Collaborator {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "away" | "offline";
  cursor?: { file: string; line: number };
}

interface Session {
  id: string;
  name: string;
  host: string;
  participants: Collaborator[];
  isActive: boolean;
}

export function CollaborativePanel() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [sessionName, setSessionName] = useState("");
  const { addNotification } = useIDEStore();

  // Mock collaborators
  const mockCollaborators: Collaborator[] = [
    { id: "1", name: "You", avatar: "👤", status: "online" },
    { id: "2", name: "Alice", avatar: "👩", status: "online", cursor: { file: "page.tsx", line: 15 } },
    { id: "3", name: "Bob", avatar: "👨", status: "away" },
  ];

  const handleCreateSession = () => {
    if (!sessionName.trim()) return;

    const newSession: Session = {
      id: Date.now().toString(),
      name: sessionName,
      host: "You",
      participants: [mockCollaborators[0]],
      isActive: true,
    };

    setSessions([...sessions, newSession]);
    setCurrentSession(newSession);
    setIsCreating(false);
    setSessionName("");
    addNotification(`Session "${sessionName}" created`, "success");
  };

  const handleJoinSession = (session: Session) => {
    setCurrentSession(session);
    addNotification(`Joined "${session.name}"`, "success");
  };

  const handleLeaveSession = () => {
    if (currentSession) {
      addNotification(`Left "${currentSession.name}"`, "info");
      setCurrentSession(null);
    }
  };

  return (
    <div className="h-full bg-[#252526] flex flex-col">
      {/* Header */}
      <div className="px-4 py-2 border-b border-[#3c3c3c]">
        <div className="text-xs uppercase tracking-wider text-gray-400">
          Collaborative
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {currentSession ? (
          <div className="space-y-4">
            {/* Current Session */}
            <div className="bg-[#1e1e1e] border border-[#3c3c3c] rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">
                  {currentSession.name}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">
                  Active
                </span>
              </div>
              <div className="text-xs text-gray-400">
                Host: {currentSession.host}
              </div>
            </div>

            {/* Participants */}
            <div>
              <h3 className="text-xs text-gray-400 mb-2">
                Participants ({mockCollaborators.length})
              </h3>
              <div className="space-y-2">
                {mockCollaborators.map((collab) => (
                  <div
                    key={collab.id}
                    className="flex items-center gap-2 bg-[#1e1e1e] rounded p-2"
                  >
                    <span className="text-lg">{collab.avatar}</span>
                    <div className="flex-1">
                      <div className="text-sm text-white">{collab.name}</div>
                      {collab.cursor && (
                        <div className="text-xs text-gray-500">
                          Editing: {collab.cursor.file}:{collab.cursor.line}
                        </div>
                      )}
                    </div>
                    <span
                      className={cn(
                        "w-2 h-2 rounded-full",
                        collab.status === "online" && "bg-green-400",
                        collab.status === "away" && "bg-yellow-400",
                        collab.status === "offline" && "bg-gray-400"
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button
                className="w-full text-xs px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => addNotification("Share link copied!", "success")}
              >
                📋 Share Session Link
              </button>
              <button
                className="w-full text-xs px-3 py-2 rounded bg-[#3c3c3c] text-gray-300 hover:bg-[#4c4c4c]"
                onClick={() => addNotification("Screen sharing started", "info")}
              >
                🖥️ Share Screen
              </button>
              <button
                className="w-full text-xs px-3 py-2 rounded bg-red-600/20 text-red-400 hover:bg-red-600/30"
                onClick={handleLeaveSession}
              >
                🚪 Leave Session
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Create Session */}
            {isCreating ? (
              <div className="bg-[#1e1e1e] border border-[#3c3c3c] rounded-lg p-3 space-y-2">
                <input
                  type="text"
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  placeholder="Session name..."
                  className="w-full bg-[#3c3c3c] text-white rounded px-3 py-2 text-sm outline-none"
                  onKeyDown={(e) => e.key === "Enter" && handleCreateSession()}
                />
                <div className="flex gap-2">
                  <button
                    className="flex-1 text-xs px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                    onClick={handleCreateSession}
                  >
                    Create
                  </button>
                  <button
                    className="flex-1 text-xs px-3 py-2 rounded bg-[#3c3c3c] text-gray-300 hover:bg-[#4c4c4c]"
                    onClick={() => setIsCreating(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="w-full text-xs px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => setIsCreating(true)}
              >
                ➕ Create Session
              </button>
            )}

            {/* Available Sessions */}
            <div>
              <h3 className="text-xs text-gray-400 mb-2">Available Sessions</h3>
              {sessions.length === 0 ? (
                <div className="text-center text-gray-500 text-sm py-4">
                  No active sessions
                </div>
              ) : (
                <div className="space-y-2">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className="bg-[#1e1e1e] border border-[#3c3c3c] rounded-lg p-3"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-white">{session.name}</span>
                        <span className="text-xs text-gray-400">
                          {session.participants.length} users
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mb-2">
                        Host: {session.host}
                      </div>
                      <button
                        className="w-full text-xs px-3 py-1.5 rounded bg-green-600/20 text-green-400 hover:bg-green-600/30"
                        onClick={() => handleJoinSession(session)}
                      >
                        Join Session
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="bg-[#1e1e1e] border border-[#3c3c3c] rounded-lg p-3">
              <div className="text-xs text-gray-400">
                💡 <strong>Collaborative Features:</strong>
                <ul className="mt-1 space-y-1 list-disc list-inside">
                  <li>Real-time code editing</li>
                  <li>Shared terminal</li>
                  <li>Voice chat</li>
                  <li>Screen sharing</li>
                  <li>Cursor presence</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
