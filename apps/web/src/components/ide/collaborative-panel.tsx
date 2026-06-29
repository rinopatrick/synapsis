"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useIDEStore } from "@/hooks/use-ide-store";
import { useCollaborative, CollaborativeUser, SharedSession } from "@/hooks/use-collaborative";

const mockUsers: CollaborativeUser[] = [
  { id: "1", name: "You", avatar: "👤", status: "online", xp: 1250, level: 5 },
  { id: "2", name: "Alice", avatar: "👩", status: "learning", currentTopic: "React Hooks", xp: 3200, level: 12 },
  { id: "3", name: "Bob", avatar: "👨", status: "idle", xp: 800, level: 3 },
  { id: "4", name: "Carol", avatar: "👩‍💻", status: "learning", currentTopic: "TypeScript", xp: 2100, level: 8 },
];

const mockSessions: SharedSession[] = [
  {
    id: "session-1",
    hostId: "2",
    topic: "React Hooks Deep Dive",
    participants: [mockUsers[1], mockUsers[3]],
    maxParticipants: 5,
    status: "active",
    createdAt: new Date(Date.now() - 1800000),
  },
  {
    id: "session-2",
    hostId: "4",
    topic: "TypeScript Generics",
    participants: [mockUsers[3]],
    maxParticipants: 4,
    status: "waiting",
    createdAt: new Date(Date.now() - 600000),
  },
];

export function CollaborativePanel() {
  const [isCreating, setIsCreating] = useState(false);
  const [topic, setTopic] = useState("");
  const { addNotification } = useIDEStore();
  const {
    sessions,
    currentSession,
    createSession,
    joinSession,
    leaveSession,
  } = useCollaborative();

  const allSessions = [...mockSessions, ...sessions];

  const handleCreateSession = () => {
    if (!topic.trim()) return;
    createSession(topic);
    setIsCreating(false);
    setTopic("");
    addNotification(`Session "${topic}" created`, "success");
  };

  const handleJoinSession = (sessionId: string) => {
    joinSession(sessionId);
    addNotification("Joined learning session", "success");
  };

  const handleLeaveSession = () => {
    leaveSession();
    addNotification("Left session", "info");
  };

  const getStatusColor = (status: CollaborativeUser["status"]) => {
    switch (status) {
      case "online":
        return "bg-green-400";
      case "learning":
        return "bg-blue-400";
      case "idle":
        return "bg-yellow-400";
    }
  };

  const getSessionStatusBadge = (status: SharedSession["status"]) => {
    switch (status) {
      case "waiting":
        return "bg-yellow-500/20 text-yellow-400";
      case "active":
        return "bg-green-500/20 text-green-400";
      case "completed":
        return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="h-full bg-[#252526] flex flex-col">
      <div className="px-4 py-2 border-b border-[#3c3c3c]">
        <div className="text-xs uppercase tracking-wider text-gray-400">
          Collaborative Learning
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {currentSession ? (
          <>
            <div className="bg-[#1e1e1e] border border-[#3c3c3c] rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">
                  {currentSession.topic}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">
                  Learning Together
                </span>
              </div>
              <div className="text-xs text-gray-400">
                {currentSession.participants.length}/{currentSession.maxParticipants} participants
              </div>
            </div>

            <div>
              <h3 className="text-xs text-gray-400 mb-2">Participants</h3>
              <div className="space-y-2">
                {mockUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-2 bg-[#1e1e1e] rounded p-2"
                  >
                    <span className="text-lg">{user.avatar}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-white">{user.name}</span>
                        <span className="text-xs text-gray-500">Lv.{user.level}</span>
                      </div>
                      {user.currentTopic && (
                        <div className="text-xs text-blue-400 truncate">
                          📚 {user.currentTopic}
                        </div>
                      )}
                    </div>
                    <span className={cn("w-2 h-2 rounded-full", getStatusColor(user.status))} />
                  </div>
                ))}
              </div>
            </div>

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
          </>
        ) : (
          <>
            {isCreating ? (
              <div className="bg-[#1e1e1e] border border-[#3c3c3c] rounded-lg p-3 space-y-2">
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Learning topic..."
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
                ➕ Create Learning Session
              </button>
            )}

            <div>
              <h3 className="text-xs text-gray-400 mb-2">Active Learners</h3>
              <div className="flex gap-1 flex-wrap">
                {mockUsers
                  .filter((u) => u.status !== "idle")
                  .map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-1 bg-[#1e1e1e] rounded-full px-2 py-1"
                      title={`${user.name} - ${user.currentTopic || "Browsing"}`}
                    >
                      <span className="text-sm">{user.avatar}</span>
                      <span className="text-xs text-gray-300">{user.name}</span>
                      <span className={cn("w-1.5 h-1.5 rounded-full", getStatusColor(user.status))} />
                    </div>
                  ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs text-gray-400 mb-2">Available Sessions</h3>
              {allSessions.length === 0 ? (
                <div className="text-center text-gray-500 text-sm py-4">
                  No active sessions
                </div>
              ) : (
                <div className="space-y-2">
                  {allSessions.map((session) => (
                    <div
                      key={session.id}
                      className="bg-[#1e1e1e] border border-[#3c3c3c] rounded-lg p-3"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-white">{session.topic}</span>
                        <span
                          className={cn(
                            "text-xs px-2 py-0.5 rounded-full",
                            getSessionStatusBadge(session.status)
                          )}
                        >
                          {session.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex -space-x-1">
                          {session.participants.slice(0, 3).map((p) => (
                            <span key={p.id} className="text-sm">
                              {p.avatar}
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">
                          {session.participants.length}/{session.maxParticipants}
                        </span>
                      </div>
                      <button
                        className="w-full text-xs px-3 py-1.5 rounded bg-green-600/20 text-green-400 hover:bg-green-600/30"
                        onClick={() => handleJoinSession(session.id)}
                      >
                        Join Session
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-[#1e1e1e] border border-[#3c3c3c] rounded-lg p-3">
              <div className="text-xs text-gray-400">
                💡 <strong>Learn Together:</strong>
                <ul className="mt-1 space-y-1 list-disc list-inside">
                  <li>Shared learning sessions</li>
                  <li>Real-time progress tracking</li>
                  <li>Peer XP and levels</li>
                  <li>Topic-based matching</li>
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
