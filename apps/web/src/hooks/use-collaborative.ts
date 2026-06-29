import { create } from "zustand";

export interface CollaborativeUser {
  id: string;
  name: string;
  avatar?: string;
  status: "online" | "learning" | "idle";
  currentTopic?: string;
  xp: number;
  level: number;
}

export interface SharedSession {
  id: string;
  hostId: string;
  topic: string;
  participants: CollaborativeUser[];
  maxParticipants: number;
  status: "waiting" | "active" | "completed";
  createdAt: Date;
}

interface CollaborativeStore {
  users: CollaborativeUser[];
  sessions: SharedSession[];
  currentSession: SharedSession | null;
  isConnecting: boolean;

  setUsers: (users: CollaborativeUser[]) => void;
  addSession: (session: SharedSession) => void;
  joinSession: (sessionId: string) => void;
  leaveSession: () => void;
  createSession: (topic: string) => void;
}

export const useCollaborative = create<CollaborativeStore>((set, get) => ({
  users: [],
  sessions: [],
  currentSession: null,
  isConnecting: false,

  setUsers: (users) => set({ users }),

  addSession: (session) =>
    set((state) => ({ sessions: [...state.sessions, session] })),

  joinSession: (sessionId) => {
    const session = get().sessions.find((s) => s.id === sessionId);
    if (session) {
      set({ currentSession: session });
    }
  },

  leaveSession: () => set({ currentSession: null }),

  createSession: (topic) => {
    const newSession: SharedSession = {
      id: `session-${Date.now()}`,
      hostId: "current-user",
      topic,
      participants: [],
      maxParticipants: 5,
      status: "waiting",
      createdAt: new Date(),
    };
    set((state) => ({
      sessions: [...state.sessions, newSession],
      currentSession: newSession,
    }));
  },
}));
