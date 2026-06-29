import { create } from "zustand";

interface EditorPane {
  id: string;
  fileId: string | null;
  scrollPosition: { top: number; left: number };
  cursorPosition: { line: number; column: number };
}

interface MultiEditorStore {
  panes: EditorPane[];
  activePaneId: string | null;
  splitDirection: "horizontal" | "vertical";

  createPane: (fileId?: string) => string;
  closePane: (paneId: string) => void;
  setActivePane: (paneId: string) => void;
  setPaneFile: (paneId: string, fileId: string) => void;
  updateScroll: (paneId: string, position: { top: number; left: number }) => void;
  updateCursor: (paneId: string, position: { line: number; column: number }) => void;
  setSplitDirection: (direction: "horizontal" | "vertical") => void;
  splitPane: (paneId: string) => void;
}

export const useMultiEditor = create<MultiEditorStore>((set, get) => ({
  panes: [
    {
      id: "main",
      fileId: null,
      scrollPosition: { top: 0, left: 0 },
      cursorPosition: { line: 0, column: 0 },
    },
  ],
  activePaneId: "main",
  splitDirection: "vertical",

  createPane: (fileId) => {
    const id = `pane-${Date.now()}`;
    set((state) => ({
      panes: [
        ...state.panes,
        {
          id,
          fileId: fileId || null,
          scrollPosition: { top: 0, left: 0 },
          cursorPosition: { line: 0, column: 0 },
        },
      ],
      activePaneId: id,
    }));
    return id;
  },

  closePane: (paneId) => {
    set((state) => {
      const newPanes = state.panes.filter((p) => p.id !== paneId);
      if (newPanes.length === 0) {
        newPanes.push({
          id: "main",
          fileId: null,
          scrollPosition: { top: 0, left: 0 },
          cursorPosition: { line: 0, column: 0 },
        });
      }
      return {
        panes: newPanes,
        activePaneId:
          state.activePaneId === paneId ? newPanes[0].id : state.activePaneId,
      };
    });
  },

  setActivePane: (paneId) => set({ activePaneId: paneId }),

  setPaneFile: (paneId, fileId) =>
    set((state) => ({
      panes: state.panes.map((p) =>
        p.id === paneId ? { ...p, fileId } : p
      ),
    })),

  updateScroll: (paneId, position) =>
    set((state) => ({
      panes: state.panes.map((p) =>
        p.id === paneId ? { ...p, scrollPosition: position } : p
      ),
    })),

  updateCursor: (paneId, position) =>
    set((state) => ({
      panes: state.panes.map((p) =>
        p.id === paneId ? { ...p, cursorPosition: position } : p
      ),
    })),

  setSplitDirection: (direction) => set({ splitDirection: direction }),

  splitPane: (paneId) => {
    const state = get();
    const pane = state.panes.find((p) => p.id === paneId);
    if (pane) {
      state.createPane(pane.fileId || undefined);
    }
  },
}));
