import { create } from "zustand";

interface DebugState {
  sessionId: string | null;
  isRunning: boolean;
  currentFile: string | null;
  currentLine: number | null;
  breakpoints: Map<string, Set<number>>;
  variables: Record<string, any>;
  callStack: string[];
  evaluateExpression: string;
  evaluateResult: string;

  startDebug: (file: string) => Promise<void>;
  stopDebug: () => Promise<void>;
  setBreakpoint: (file: string, line: number) => void;
  removeBreakpoint: (file: string, line: number) => void;
  toggleBreakpoint: (file: string, line: number) => void;
  continue: () => Promise<void>;
  stepOver: () => Promise<void>;
  stepInto: () => Promise<void>;
  stepOut: () => Promise<void>;
  evaluate: (expression: string) => Promise<string>;
  setEvaluateExpression: (expression: string) => void;
  hasBreakpoint: (file: string, line: number) => boolean;
  getBreakpoints: (file: string) => number[];
}

export const useDebug = create<DebugState>((set, get) => ({
  sessionId: null,
  isRunning: false,
  currentFile: null,
  currentLine: null,
  breakpoints: new Map(),
  variables: {},
  callStack: [],
  evaluateExpression: "",
  evaluateResult: "",

  startDebug: async (file) => {
    try {
      const response = await fetch("/api/debug", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start", file }),
      });
      const data = await response.json();
      if (data.sessionId) {
        set({ sessionId: data.sessionId, isRunning: true, currentFile: file });
      }
    } catch (error) {
      console.error("Failed to start debug session:", error);
    }
  },

  stopDebug: async () => {
    const { sessionId } = get();
    if (!sessionId) return;

    try {
      await fetch("/api/debug", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "stop", sessionId }),
      });
    } catch (error) {
      console.error("Failed to stop debug session:", error);
    }

    set({ sessionId: null, isRunning: false, currentLine: null, variables: {}, callStack: [] });
  },

  setBreakpoint: (file, line) => {
    set((state) => {
      const newBreakpoints = new Map(state.breakpoints);
      const fileBreakpoints = new Set(newBreakpoints.get(file) || []);
      fileBreakpoints.add(line);
      newBreakpoints.set(file, fileBreakpoints);
      return { breakpoints: newBreakpoints };
    });
  },

  removeBreakpoint: (file, line) => {
    set((state) => {
      const newBreakpoints = new Map(state.breakpoints);
      const fileBreakpoints = newBreakpoints.get(file);
      if (fileBreakpoints) {
        fileBreakpoints.delete(line);
        if (fileBreakpoints.size === 0) {
          newBreakpoints.delete(file);
        }
      }
      return { breakpoints: newBreakpoints };
    });
  },

  toggleBreakpoint: (file, line) => {
    const { hasBreakpoint, setBreakpoint, removeBreakpoint } = get();
    if (hasBreakpoint(file, line)) {
      removeBreakpoint(file, line);
    } else {
      setBreakpoint(file, line);
    }
  },

  continue: async () => {
    const { sessionId } = get();
    if (!sessionId) return;

    try {
      await fetch("/api/debug", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "continue", sessionId }),
      });
      set({ isRunning: true, currentLine: null });
    } catch (error) {
      console.error("Failed to continue:", error);
    }
  },

  stepOver: async () => {
    const { sessionId } = get();
    if (!sessionId) return;

    try {
      const response = await fetch("/api/debug", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "stepOver", sessionId }),
      });
      const data = await response.json();
      set({ currentLine: data.currentLine, isRunning: false });
    } catch (error) {
      console.error("Failed to step over:", error);
    }
  },

  stepInto: async () => {
    const { sessionId } = get();
    if (!sessionId) return;

    try {
      const response = await fetch("/api/debug", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "stepInto", sessionId }),
      });
      const data = await response.json();
      set({ currentLine: data.currentLine, isRunning: false });
    } catch (error) {
      console.error("Failed to step into:", error);
    }
  },

  stepOut: async () => {
    const { sessionId } = get();
    if (!sessionId) return;

    try {
      const response = await fetch("/api/debug", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "stepOut", sessionId }),
      });
      const data = await response.json();
      set({ currentLine: data.currentLine, isRunning: false });
    } catch (error) {
      console.error("Failed to step out:", error);
    }
  },

  evaluate: async (expression) => {
    const { sessionId } = get();
    if (!sessionId) return "";

    try {
      const response = await fetch("/api/debug", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "evaluate", sessionId, expression }),
      });
      const data = await response.json();
      set({ evaluateResult: data.result });
      return data.result;
    } catch (error) {
      console.error("Failed to evaluate:", error);
      return "";
    }
  },

  setEvaluateExpression: (expression) => {
    set({ evaluateExpression: expression });
  },

  hasBreakpoint: (file, line) => {
    const { breakpoints } = get();
    return breakpoints.get(file)?.has(line) ?? false;
  },

  getBreakpoints: (file) => {
    const { breakpoints } = get();
    return Array.from(breakpoints.get(file) || []);
  },
}));
