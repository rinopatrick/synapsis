import type { Extension } from "@synapsis/core";

export const codeFormatterExtension: Extension = {
  id: "code-formatter",
  name: "Code Formatter",
  description: "Format code with Prettier-style formatting rules",
  version: "1.0.0",
  author: "Synapsis",
  enabled: false,
  activate: (context) => {
    context.registerCommand("formatDocument", () => {
      console.log("Formatting document...");
    });
    context.registerCommand("formatSelection", () => {
      console.log("Formatting selection...");
    });
  },
  deactivate: () => {
    console.log("Code Formatter deactivated");
  },
};
