"use client";

import { useState } from "react";
import { useSnippets } from "@/hooks/use-snippets";
import { cn } from "@/lib/utils";

interface SnippetsPanelProps {
  onInsert: (code: string) => void;
}

export function SnippetsPanel({ onInsert }: SnippetsPanelProps) {
  const { snippets, filter, setFilter, addCustomSnippet } = useSnippets();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSnippet, setNewSnippet] = useState({
    name: "",
    description: "",
    language: "javascript",
    category: "Custom",
    code: "",
  });

  const languages = [...new Set(snippets.map(s => s.language))];
  const categories = [...new Set(snippets.map(s => s.category))];

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-[#3c3c3c]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-white">Snippets</span>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="text-xs text-blue-400 hover:text-blue-300"
          >
            {showAddForm ? "Cancel" : "+ Add"}
          </button>
        </div>

        <input
          type="text"
          placeholder="Search snippets..."
          value={filter.search}
          onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
          className="w-full px-2 py-1 text-sm bg-[#3c3c3c] text-white rounded border border-[#505050] focus:border-blue-500 focus:outline-none mb-2"
        />

        <div className="flex gap-2">
          <select
            value={filter.language}
            onChange={(e) => setFilter(prev => ({ ...prev, language: e.target.value }))}
            className="flex-1 px-2 py-1 text-xs bg-[#3c3c3c] text-white rounded border border-[#505050]"
          >
            <option value="">All Languages</option>
            {languages.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
          <select
            value={filter.category}
            onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value }))}
            className="flex-1 px-2 py-1 text-xs bg-[#3c3c3c] text-white rounded border border-[#505050]"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {showAddForm && (
        <div className="p-3 border-b border-[#3c3c3c] bg-[#252526]">
          <input
            placeholder="Name"
            value={newSnippet.name}
            onChange={(e) => setNewSnippet(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-2 py-1 text-sm bg-[#3c3c3c] text-white rounded mb-2"
          />
          <textarea
            placeholder="Code"
            value={newSnippet.code}
            onChange={(e) => setNewSnippet(prev => ({ ...prev, code: e.target.value }))}
            className="w-full h-20 px-2 py-1 text-sm bg-[#3c3c3c] text-white rounded mb-2 font-mono"
          />
          <button
            onClick={() => {
              addCustomSnippet(newSnippet);
              setNewSnippet({ name: "", description: "", language: "javascript", category: "Custom", code: "" });
              setShowAddForm(false);
            }}
            className="w-full px-3 py-1 text-sm bg-blue-600 text-white rounded"
          >
            Save Snippet
          </button>
        </div>
      )}

      <div className="flex-1 overflow-auto">
        {snippets.map((snippet) => (
          <div
            key={snippet.id}
            className="px-3 py-2 border-b border-[#3c3c3c] hover:bg-[#2a2d2e] cursor-pointer"
            onClick={() => onInsert(snippet.code)}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-white">{snippet.name}</span>
              <span className="text-xs text-gray-500">{snippet.language}</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">{snippet.description}</p>
            {snippet.prefix && (
              <span className="text-xs text-blue-400 mt-1">Type: {snippet.prefix}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
