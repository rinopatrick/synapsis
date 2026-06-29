"use client";

import { useState } from "react";
import { useIDEStore } from "@/hooks/use-ide-store";

interface Workspace {
  id: string;
  name: string;
  path: string;
  lastOpened: Date;
  files: string[];
}

export function useWorkspace() {
  const { addNotification, openFile, setShowWelcome } = useIDEStore();
  const [workspaces, setWorkspaces] = useState<Workspace[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("synapsis-workspaces");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("synapsis-current-workspace");
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });

  const saveWorkspaces = (ws: Workspace[]) => {
    setWorkspaces(ws);
    localStorage.setItem("synapsis-workspaces", JSON.stringify(ws));
  };

  const createWorkspace = (name: string) => {
    const newWorkspace: Workspace = {
      id: Date.now().toString(),
      name,
      path: `/${name.toLowerCase().replace(/\s+/g, "-")}`,
      lastOpened: new Date(),
      files: [],
    };

    saveWorkspaces([...workspaces, newWorkspace]);
    setCurrentWorkspace(newWorkspace);
    localStorage.setItem("synapsis-current-workspace", JSON.stringify(newWorkspace));
    setShowWelcome(false);
    addNotification(`Workspace "${name}" created`, "success");
    return newWorkspace;
  };

  const openWorkspace = (workspace: Workspace) => {
    const updated = { ...workspace, lastOpened: new Date() };
    const newWorkspaces = workspaces.map((w) =>
      w.id === workspace.id ? updated : w
    );
    saveWorkspaces(newWorkspaces);
    setCurrentWorkspace(updated);
    localStorage.setItem("synapsis-current-workspace", JSON.stringify(updated));
    setShowWelcome(false);
    addNotification(`Opened "${workspace.name}"`, "success");
  };

  const deleteWorkspace = (id: string) => {
    const newWorkspaces = workspaces.filter((w) => w.id !== id);
    saveWorkspaces(newWorkspaces);
    if (currentWorkspace?.id === id) {
      setCurrentWorkspace(null);
      localStorage.removeItem("synapsis-current-workspace");
    }
    addNotification("Workspace deleted", "info");
  };

  const renameWorkspace = (id: string, newName: string) => {
    const newWorkspaces = workspaces.map((w) =>
      w.id === id ? { ...w, name: newName } : w
    );
    saveWorkspaces(newWorkspaces);
    if (currentWorkspace?.id === id) {
      const updated = { ...currentWorkspace, name: newName };
      setCurrentWorkspace(updated);
      localStorage.setItem("synapsis-current-workspace", JSON.stringify(updated));
    }
    addNotification(`Renamed to "${newName}"`, "success");
  };

  // Real file operations
  const createNewFile = (name: string, content: string = "") => {
    const ext = name.split(".").pop() || "";
    const langMap: Record<string, string> = {
      ts: "typescript",
      tsx: "typescript",
      js: "javascript",
      jsx: "javascript",
      json: "json",
      css: "css",
      html: "html",
      md: "markdown",
      py: "python",
    };

    const filePath = currentWorkspace 
      ? `${currentWorkspace.path}/${name}`
      : `/${name}`;

    openFile({
      id: filePath,
      name,
      path: filePath,
      modified: false,
      language: langMap[ext] || "plaintext",
      content: content || getDefaultContent(name),
    });

    addNotification(`Created ${name}`, "success");
  };

  const saveFile = (fileId: string, content: string) => {
    // Save to localStorage
    localStorage.setItem(`synapsis-file-${fileId}`, content);
    addNotification("File saved", "success");
  };

  const loadFile = (fileId: string): string | null => {
    return localStorage.getItem(`synapsis-file-${fileId}`);
  };

  return {
    workspaces,
    currentWorkspace,
    createWorkspace,
    openWorkspace,
    deleteWorkspace,
    renameWorkspace,
    createNewFile,
    saveFile,
    loadFile,
  };
}

function getDefaultContent(filename: string): string {
  const ext = filename.split(".").pop() || "";

  const templates: Record<string, string> = {
    ts: `// ${filename}
export function main() {
  console.log("Hello from ${filename}");
}
`,
    tsx: `// ${filename}
export default function Component() {
  return (
    <div>
      <h1>${filename}</h1>
    </div>
  );
}
`,
    js: `// ${filename}
function main() {
  console.log("Hello from ${filename}");
}

main();
`,
    jsx: `// ${filename}
export default function Component() {
  return (
    <div>
      <h1>${filename}</h1>
    </div>
  );
}
`,
    json: `{
  "name": "${filename.replace(".json", "")}",
  "version": "1.0.0"
}
`,
    css: `/* ${filename} */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}
`,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${filename.replace(".html", "")}</title>
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>
`,
    md: `# ${filename.replace(".md", "")}

## Introduction

Write your content here.
`,
    py: `# ${filename}
def main():
    print(f"Hello from ${filename}")

if __name__ == "__main__":
    main()
`,
  };

  return templates[ext] || `// ${filename}\n`;
}
