import { create } from "zustand";

export type ActivityTab = "explorer" | "search" | "git" | "debug" | "extensions" | "collab" | "chat" | "oauth" | "settings" | "dashboard";
export type BottomPanel = "terminal" | "problems" | "output";
export type LearningMode = "learning" | "builder";
export type UserLevel = "beginner" | "intermediate" | "advanced";

interface Notification {
  id: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
}

interface FileTab {
  id: string;
  name: string;
  path: string;
  modified: boolean;
  language: string;
  content: string;
}

interface IDEState {
  // Sidebar
  activeSidebar: ActivityTab;
  sidebarCollapsed: boolean;
  sidebarWidth: number;
  setActiveSidebar: (tab: ActivityTab) => void;
  toggleSidebar: () => void;
  setSidebarWidth: (width: number) => void;

  // Bottom Panel
  activeBottomPanel: BottomPanel;
  showBottomPanel: boolean;
  bottomPanelHeight: number;
  setActiveBottomPanel: (panel: BottomPanel) => void;
  toggleBottomPanel: () => void;
  setBottomPanelHeight: (height: number) => void;

  // Chat
  showChat: boolean;
  chatWidth: number;
  toggleChat: () => void;
  setChatWidth: (width: number) => void;

  // Command Palette
  showCommandPalette: boolean;
  toggleCommandPalette: () => void;

  // Welcome
  showWelcome: boolean;
  setShowWelcome: (show: boolean) => void;

  // AI / Learning
  learningMode: LearningMode;
  userLevel: UserLevel;
  setLearningMode: (mode: LearningMode) => void;
  setUserLevel: (level: UserLevel) => void;

  // Notifications
  notifications: Notification[];
  addNotification: (message: string, type?: Notification["type"]) => void;
  removeNotification: (id: string) => void;

  // Terminal
  terminalLines: { type: string; content: string }[];
  addTerminalLine: (type: string, content: string) => void;
  clearTerminal: () => void;

  // Files
  activeFile: string | null;
  openFiles: FileTab[];
  setActiveFile: (id: string | null) => void;
  openFile: (file: FileTab) => void;
  closeFile: (id: string) => void;
  updateFileContent: (id: string, content: string) => void;
}

const defaultFiles: FileTab[] = [
  {
    id: "page.tsx",
    name: "page.tsx",
    path: "src/app/page.tsx",
    modified: false,
    language: "typescript",
    content: `import { Button } from "@/components/Button";
import { Card } from "@/components/Card";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Card>
        <h1 className="text-4xl font-bold mb-4">
          Welcome to Synapsis
        </h1>
        <p className="text-gray-400 mb-6">
          AI Learning IDE - Form the connection. Learn the code.
        </p>
        <Button variant="primary">
          Start Learning
        </Button>
      </Card>
    </main>
  );
}`,
  },
  {
    id: "Button.tsx",
    name: "Button.tsx",
    path: "src/components/Button.tsx",
    modified: true,
    language: "typescript",
    content: `import { cn } from "@/lib/utils";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  onClick,
  disabled = false,
  className,
}: ButtonProps) {
  const baseStyles = "rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500",
    secondary: "bg-gray-700 hover:bg-gray-600 text-white focus:ring-gray-500",
    outline: "border border-gray-600 hover:bg-gray-800 text-gray-300 focus:ring-gray-500",
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], disabled && "opacity-50 cursor-not-allowed", className)}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}`,
  },
  {
    id: "utils.ts",
    name: "utils.ts",
    path: "src/lib/utils.ts",
    modified: false,
    language: "typescript",
    content: `import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}`,
  },
];

export const useIDEStore = create<IDEState>((set, get) => ({
  // Sidebar
  activeSidebar: "explorer",
  sidebarCollapsed: false,
  sidebarWidth: 250,
  setActiveSidebar: (tab) => set({ activeSidebar: tab, sidebarCollapsed: false }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setSidebarWidth: (width) => set({ sidebarWidth: width }),

  // Bottom Panel
  activeBottomPanel: "terminal",
  showBottomPanel: true,
  bottomPanelHeight: 200,
  setActiveBottomPanel: (panel) => set({ activeBottomPanel: panel, showBottomPanel: true }),
  toggleBottomPanel: () => set((s) => ({ showBottomPanel: !s.showBottomPanel })),
  setBottomPanelHeight: (height) => set({ bottomPanelHeight: height }),

  // Chat
  showChat: true,
  chatWidth: 320,
  toggleChat: () => set((s) => ({ showChat: !s.showChat })),
  setChatWidth: (width) => set({ chatWidth: width }),

  // Command Palette
  showCommandPalette: false,
  toggleCommandPalette: () => set((s) => ({ showCommandPalette: !s.showCommandPalette })),

  // Welcome
  showWelcome: true,
  setShowWelcome: (show) => set({ showWelcome: show }),

  // AI / Learning
  learningMode: "learning",
  userLevel: "beginner",
  setLearningMode: (mode) => set({ learningMode: mode }),
  setUserLevel: (level) => set({ userLevel: level }),

  // Notifications
  notifications: [],
  addNotification: (message, type = "info") => {
    const id = Date.now().toString();
    set((s) => ({ notifications: [...s.notifications, { id, message, type }] }));
    setTimeout(() => get().removeNotification(id), 3000);
  },
  removeNotification: (id) => set((s) => ({
    notifications: s.notifications.filter((n) => n.id !== id),
  })),

  // Terminal
  terminalLines: [
    { type: "info", content: "Welcome to Synapsis Terminal" },
    { type: "info", content: "Type 'help' for available commands" },
    { type: "output", content: "" },
  ],
  addTerminalLine: (type, content) =>
    set((s) => ({ terminalLines: [...s.terminalLines, { type, content }] })),
  clearTerminal: () => set({ terminalLines: [] }),

  // Files
  activeFile: "page.tsx",
  openFiles: defaultFiles,
  setActiveFile: (id) => set({ activeFile: id, showWelcome: false }),
  openFile: (file) => {
    const { openFiles } = get();
    if (!openFiles.find((f) => f.id === file.id)) {
      set({ openFiles: [...openFiles, file] });
    }
    set({ activeFile: file.id, showWelcome: false });
  },
  closeFile: (id) => {
    const { openFiles, activeFile } = get();
    const newFiles = openFiles.filter((f) => f.id !== id);
    set({ openFiles: newFiles });
    if (activeFile === id) {
      set({ activeFile: newFiles.length > 0 ? newFiles[newFiles.length - 1].id : null });
    }
    if (newFiles.length === 0) {
      set({ showWelcome: true });
    }
  },
  updateFileContent: (id, content) => {
    set((s) => ({
      openFiles: s.openFiles.map((f) =>
        f.id === id ? { ...f, content, modified: true } : f
      ),
    }));
  },
}));
