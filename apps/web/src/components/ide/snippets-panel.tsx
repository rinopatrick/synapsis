"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useIDEStore } from "@/hooks/use-ide-store";

interface Snippet {
  id: string;
  name: string;
  language: string;
  description: string;
  code: string;
  category: string;
}

const snippets: Snippet[] = [
  {
    id: "rfc",
    name: "React Functional Component",
    language: "typescript",
    description: "Basic React functional component with TypeScript",
    code: `interface Props {
  // Add props here
}

export function ComponentName({ }: Props) {
  return (
    <div>
      {/* Component content */}
    </div>
  );
}`,
    category: "React",
  },
  {
    id: "useState",
    name: "useState Hook",
    language: "typescript",
    description: "React useState hook template",
    code: `const [value, setValue] = useState(initialValue);`,
    category: "React",
  },
  {
    id: "useEffect",
    name: "useEffect Hook",
    language: "typescript",
    description: "React useEffect hook template",
    code: `useEffect(() => {
  // Effect logic here
  
  return () => {
    // Cleanup logic here
  };
}, [dependencies]);`,
    category: "React",
  },
  {
    id: "fetch",
    name: "Fetch API",
    language: "typescript",
    description: "Basic fetch request template",
    code: `const fetchData = async () => {
  try {
    const response = await fetch('/api/endpoint');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
};`,
    category: "API",
  },
  {
    id: "express-route",
    name: "Express Route",
    language: "typescript",
    description: "Basic Express.js route handler",
    code: `router.get('/path', async (req, res) => {
  try {
    // Handler logic
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});`,
    category: "Backend",
  },
  {
    id: "try-catch",
    name: "Try-Catch",
    language: "typescript",
    description: "Error handling template",
    code: `try {
  // Code that might throw
} catch (error) {
  console.error('Error:', error);
  // Handle error
} finally {
  // Cleanup
}`,
    category: "General",
  },
];

export function SnippetsPanel() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { addNotification } = useIDEStore();

  const categories = Array.from(new Set(snippets.map((s) => s.category)));

  const filteredSnippets = snippets.filter((snippet) => {
    const matchesSearch = snippet.name.toLowerCase().includes(search.toLowerCase()) ||
                         snippet.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || snippet.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCopy = (snippet: Snippet) => {
    navigator.clipboard.writeText(snippet.code);
    addNotification(`Copied: ${snippet.name}`, "success");
  };

  return (
    <div className="h-full bg-[#252526] flex flex-col">
      {/* Header */}
      <div className="px-4 py-2 text-xs uppercase tracking-wider text-gray-400 font-medium">
        Snippets
      </div>

      {/* Search */}
      <div className="px-3 pb-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search snippets..."
          className="w-full bg-[#3c3c3c] text-white rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Categories */}
      <div className="px-3 pb-2 flex gap-1 flex-wrap">
        <button
          className={cn(
            "text-xs px-2 py-0.5 rounded",
            !selectedCategory ? "bg-blue-500 text-white" : "bg-[#3c3c3c] text-gray-400 hover:text-white"
          )}
          onClick={() => setSelectedCategory(null)}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={cn(
              "text-xs px-2 py-0.5 rounded",
              selectedCategory === cat ? "bg-blue-500 text-white" : "bg-[#3c3c3c] text-gray-400 hover:text-white"
            )}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Snippets list */}
      <div className="flex-1 overflow-auto px-3 pb-3 space-y-2">
        {filteredSnippets.map((snippet) => (
          <Card key={snippet.id} className="bg-[#1e1e1e] border-[#3c3c3c] hover:border-blue-500 cursor-pointer transition-colors">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-white">{snippet.name}</span>
                <button
                  className="text-xs text-gray-400 hover:text-white px-2 py-0.5 rounded bg-[#3c3c3c]"
                  onClick={() => handleCopy(snippet)}
                >
                  Copy
                </button>
              </div>
              <p className="text-xs text-gray-400 mb-2">{snippet.description}</p>
              <pre className="text-xs bg-[#252526] rounded p-2 overflow-x-auto">
                <code className="text-gray-300">{snippet.code.slice(0, 100)}...</code>
              </pre>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs bg-[#3c3c3c] text-gray-400 px-2 py-0.5 rounded">
                  {snippet.language}
                </span>
                <span className="text-xs text-gray-500">{snippet.category}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
