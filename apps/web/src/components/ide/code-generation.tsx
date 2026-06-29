"use client";

import { useState } from "react";
import { useCodeGeneration } from "@/hooks/use-code-generation";
import { cn } from "@/lib/utils";

interface CodeGenerationProps {
  onInsert: (code: string) => void;
  onClose: () => void;
}

export function CodeGeneration({ onInsert, onClose }: CodeGenerationProps) {
  const { isGenerating, generatedCode, error, generateCode, clearGenerated } = useCodeGeneration();
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("javascript");

  const handleGenerate = async () => {
    if (!description.trim()) return;
    await generateCode(description, language);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1e1e1e] border border-[#3c3c3c] rounded-lg w-[600px] max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-[#3c3c3c] flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">Generate Code with AI</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl leading-none">&times;</button>
        </div>

        <div className="p-4 space-y-4 flex-1 overflow-auto">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Describe what you want</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., A function that sorts an array of objects by a specific property..."
              className="w-full h-24 px-3 py-2 text-sm bg-[#3c3c3c] text-white rounded border border-[#505050] focus:border-blue-500 focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-[#3c3c3c] text-white rounded border border-[#505050]"
            >
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="rust">Rust</option>
              <option value="go">Go</option>
            </select>
          </div>

          {error && <div className="text-sm text-red-400">{error}</div>}

          {generatedCode && (
            <div>
              <label className="block text-sm text-gray-400 mb-1">Generated Code</label>
              <pre className="p-3 bg-[#252526] rounded text-sm text-green-400 font-mono overflow-auto max-h-48">
                {generatedCode}
              </pre>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-[#3c3c3c] flex justify-end gap-3">
          <button
            onClick={() => { clearGenerated(); setDescription(""); }}
            className="px-4 py-2 text-sm text-gray-300 hover:text-white"
          >
            Clear
          </button>
          {generatedCode && (
            <button
              onClick={() => onInsert(generatedCode)}
              className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded"
            >
              Insert Code
            </button>
          )}
          <button
            onClick={handleGenerate}
            disabled={!description.trim() || isGenerating}
            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
          >
            {isGenerating ? "Generating..." : "Generate"}
          </button>
        </div>
      </div>
    </div>
  );
}
