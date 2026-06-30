"use client";

import { create } from "zustand";

export type Theme = "dark" | "light" | "monokai" | "dracula" | "github-dark";

interface ThemeColors {
  background: string;
  foreground: string;
  sidebar: string;
  editor: string;
  accent: string;
  border: string;
  muted: string;
}

const themes: Record<Theme, ThemeColors> = {
  dark: {
    background: "#1e1e1e",
    foreground: "#d4d4d4",
    sidebar: "#252526",
    editor: "#1e1e1e",
    accent: "#007acc",
    border: "#3c3c3c",
    muted: "#6b7280",
  },
  light: {
    background: "#ffffff",
    foreground: "#333333",
    sidebar: "#f3f3f3",
    editor: "#ffffff",
    accent: "#0066b8",
    border: "#e0e0e0",
    muted: "#6b7280",
  },
  monokai: {
    background: "#272822",
    foreground: "#f8f8f2",
    sidebar: "#1e1f1c",
    editor: "#272822",
    accent: "#a6e22e",
    border: "#3e3d32",
    muted: "#75715e",
  },
  dracula: {
    background: "#282a36",
    foreground: "#f8f8f2",
    sidebar: "#21222c",
    editor: "#282a36",
    accent: "#bd93f9",
    border: "#44475a",
    muted: "#6272a4",
  },
  "github-dark": {
    background: "#0d1117",
    foreground: "#c9d1d9",
    sidebar: "#161b22",
    editor: "#0d1117",
    accent: "#58a6ff",
    border: "#30363d",
    muted: "#8b949e",
  },
};

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const saved = localStorage.getItem("synapsis-theme");
  if (saved && saved in themes) return saved as Theme;
  return "dark";
}

interface ThemeState {
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
  getColors: () => ThemeColors;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  currentTheme: getInitialTheme(),
  setTheme: (theme) => {
    localStorage.setItem("synapsis-theme", theme);
    set({ currentTheme: theme });
  },
  getColors: () => themes[get().currentTheme],
}));

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { currentTheme } = useThemeStore();
  const colors = themes[currentTheme];

  return (
    <div
      style={{
        "--bg": colors.background,
        "--fg": colors.foreground,
        "--sidebar": colors.sidebar,
        "--editor": colors.editor,
        "--accent": colors.accent,
        "--border": colors.border,
        "--muted": colors.muted,
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
