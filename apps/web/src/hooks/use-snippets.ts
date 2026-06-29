import { useState, useCallback, useEffect } from "react";
import { builtinSnippets, type Snippet } from "@/data/snippets";

export function useSnippets() {
  const [snippets, setSnippets] = useState<Snippet[]>(builtinSnippets);
  const [customSnippets, setCustomSnippets] = useState<Snippet[]>([]);
  const [filter, setFilter] = useState({ language: "", category: "", search: "" });

  useEffect(() => {
    const saved = localStorage.getItem("custom-snippets");
    if (saved) {
      setCustomSnippets(JSON.parse(saved));
    }
  }, []);

  const allSnippets = [...snippets, ...customSnippets];

  const filteredSnippets = allSnippets.filter(s => {
    if (filter.language && s.language !== filter.language) return false;
    if (filter.category && s.category !== filter.category) return false;
    if (filter.search && !s.name.toLowerCase().includes(filter.search.toLowerCase()) &&
        !s.description.toLowerCase().includes(filter.search.toLowerCase())) return false;
    return true;
  });

  const addCustomSnippet = useCallback((snippet: Omit<Snippet, "id">) => {
    const newSnippet: Snippet = {
      ...snippet,
      id: `custom-${Date.now()}`,
    };
    setCustomSnippets(prev => {
      const updated = [...prev, newSnippet];
      localStorage.setItem("custom-snippets", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeCustomSnippet = useCallback((id: string) => {
    setCustomSnippets(prev => {
      const updated = prev.filter(s => s.id !== id);
      localStorage.setItem("custom-snippets", JSON.stringify(updated));
      return updated;
    });
  }, []);

  return {
    snippets: filteredSnippets,
    allSnippets,
    filter,
    setFilter,
    addCustomSnippet,
    removeCustomSnippet,
  };
}
