import { create } from "zustand";
import type { Extension, ExtensionContext } from "@synapsis/core";

interface ExtensionStore {
  extensions: Extension[];
  activeExtensions: Set<string>;

  registerExtension: (extension: Extension) => void;
  unregisterExtension: (id: string) => void;
  enableExtension: (id: string) => void;
  disableExtension: (id: string) => void;
  getExtensionContext: (id: string) => ExtensionContext;
}

export const useExtensions = create<ExtensionStore>((set, get) => ({
  extensions: [],
  activeExtensions: new Set(),

  registerExtension: (extension) =>
    set((state) => ({
      extensions: [...state.extensions, extension],
    })),

  unregisterExtension: (id) =>
    set((state) => ({
      extensions: state.extensions.filter((e) => e.id !== id),
    })),

  enableExtension: (id) => {
    const ext = get().extensions.find((e) => e.id === id);
    if (ext) {
      const context = get().getExtensionContext(id);
      ext.activate(context);
      set((state) => {
        const newActive = new Set(state.activeExtensions);
        newActive.add(id);
        return {
          activeExtensions: newActive,
          extensions: state.extensions.map((e) =>
            e.id === id ? { ...e, enabled: true } : e
          ),
        };
      });
    }
  },

  disableExtension: (id) => {
    const ext = get().extensions.find((e) => e.id === id);
    if (ext) {
      ext.deactivate();
      set((state) => {
        const newActive = new Set(state.activeExtensions);
        newActive.delete(id);
        return {
          activeExtensions: newActive,
          extensions: state.extensions.map((e) =>
            e.id === id ? { ...e, enabled: false } : e
          ),
        };
      });
    }
  },

  getExtensionContext: (id: string): ExtensionContext => ({
    registerCommand: (cmdId, handler) => {
      console.log(`[${id}] Registered command: ${cmdId}`);
    },
    registerProvider: (type, provider) => {
      console.log(`[${id}] Registered provider: ${type}`);
    },
    getConfiguration: (key) => {
      if (typeof window === "undefined") return undefined;
      const val = localStorage.getItem(`ext.${id}.${key}`);
      if (val === null) return undefined;
      try {
        return JSON.parse(val);
      } catch {
        return val;
      }
    },
    updateConfiguration: (key, value) => {
      if (typeof window !== "undefined") {
        localStorage.setItem(`ext.${id}.${key}`, JSON.stringify(value));
      }
    },
  }),
}));
