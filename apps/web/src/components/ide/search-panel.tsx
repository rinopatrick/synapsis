"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useIDEStore } from "@/hooks/use-ide-store";

interface SearchResult {
  file: string;
  line: number;
  column: number;
  text: string;
  match: string;
}

export function SearchPanel() {
  const [query, setQuery] = useState("");
  const [replaceQuery, setReplaceQuery] = useState("");
  const [showReplace, setShowReplace] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { openFiles, setActiveFile, addNotification, openFile } = useIDEStore();

  const handleSearch = () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    const searchResults: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    // Search through all open files
    openFiles.forEach((file) => {
      const lines = file.content.split("\n");
      lines.forEach((line, lineIndex) => {
        const lowerLine = line.toLowerCase();
        let columnIndex = lowerLine.indexOf(lowerQuery);
        while (columnIndex !== -1) {
          searchResults.push({
            file: file.name,
            line: lineIndex + 1,
            column: columnIndex + 1,
            text: line.trim(),
            match: line.substring(
              Math.max(0, columnIndex - 20),
              Math.min(line.length, columnIndex + query.length + 20)
            ),
          });
          columnIndex = lowerLine.indexOf(lowerQuery, columnIndex + 1);
        }
      });
    });

    setTimeout(() => {
      setResults(searchResults);
      setIsSearching(false);
      addNotification(`Found ${searchResults.length} results`, "info");
    }, 300);
  };

  const handleReplaceAll = () => {
    if (!query.trim() || !replaceQuery.trim()) return;

    let replacedCount = 0;
    openFiles.forEach((file) => {
      if (file.content.includes(query)) {
        const newContent = file.content.replaceAll(query, replaceQuery);
        // Update file content
        replacedCount += (file.content.match(new RegExp(query, "g")) || []).length;
      }
    });

    addNotification(`Replaced ${replacedCount} occurrences`, "success");
  };

  const handleResultClick = (result: SearchResult) => {
    const file = openFiles.find((f) => f.name === result.file);
    if (file) {
      setActiveFile(file.id);
    }
  };

  return (
    <div className="h-full bg-[#252526] flex flex-col">
      {/* Header */}
      <div className="px-4 py-2 border-b border-[#3c3c3c]">
        <div className="text-xs uppercase tracking-wider text-gray-400">
          Search
        </div>
      </div>

      {/* Search Input */}
      <div className="p-3 space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search..."
            className="flex-1 bg-[#3c3c3c] text-white rounded px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            className="px-3 py-2 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleSearch}
          >
            {isSearching ? "..." : "🔍"}
          </button>
        </div>

        {/* Replace Toggle */}
        <button
          className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
          onClick={() => setShowReplace(!showReplace)}
        >
          {showReplace ? "▼" : "▶"} Replace
        </button>

        {showReplace && (
          <div className="flex gap-2">
            <input
              type="text"
              value={replaceQuery}
              onChange={(e) => setReplaceQuery(e.target.value)}
              placeholder="Replace with..."
              className="flex-1 bg-[#3c3c3c] text-white rounded px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              className="px-3 py-2 text-xs bg-green-600 text-white rounded hover:bg-green-700"
              onClick={handleReplaceAll}
            >
              All
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="flex-1 overflow-auto">
        {results.length > 0 && (
          <div className="px-3 pb-2">
            <div className="text-xs text-gray-400 mb-2">
              {results.length} results in {new Set(results.map((r) => r.file)).size} files
            </div>
          </div>
        )}

        {results.map((result, index) => (
          <div
            key={index}
            className="px-3 py-1.5 hover:bg-[#2a2d2e] cursor-pointer"
            onClick={() => handleResultClick(result)}
          >
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-500 w-12">
                {result.line}:{result.column}
              </span>
              <span className="text-blue-400">{result.file}</span>
            </div>
            <div className="text-xs text-gray-300 mt-0.5 pl-14 truncate">
              {result.match}
            </div>
          </div>
        ))}

        {query && results.length === 0 && !isSearching && (
          <div className="text-center text-gray-500 text-sm py-4">
            No results found
          </div>
        )}
      </div>
    </div>
  );
}
