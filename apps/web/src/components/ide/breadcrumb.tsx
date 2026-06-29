"use client";

import { cn } from "@/lib/utils";

interface BreadcrumbProps {
  path: string[];
  onNavigate?: (index: number) => void;
}

export function Breadcrumb({ path, onNavigate }: BreadcrumbProps) {
  return (
    <div className="bg-[#1e1e1e] px-4 py-1 text-xs text-gray-500 border-b border-[#2d2d2d] flex items-center">
      {path.map((segment, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && <span className="mx-1 text-gray-600">›</span>}
          <button
            className={cn(
              "hover:text-gray-300 transition-colors",
              index === path.length - 1 ? "text-gray-300" : "text-gray-500"
            )}
            onClick={() => onNavigate?.(index)}
          >
            {segment}
          </button>
        </div>
      ))}
    </div>
  );
}
