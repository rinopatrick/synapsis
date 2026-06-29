"use client";

import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ResizeHandleProps {
  direction: "horizontal" | "vertical";
  onResize: (delta: number) => void;
  onDoubleClick?: () => void;
  minSize?: number;
  maxSize?: number;
  className?: string;
}

export function ResizeHandle({ 
  direction, 
  onResize, 
  onDoubleClick, 
  className 
}: ResizeHandleProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);

    const startPos = direction === "horizontal" ? e.clientX : e.clientY;

    const handleMouseMove = (e: MouseEvent) => {
      const currentPos = direction === "horizontal" ? e.clientX : e.clientY;
      const delta = currentPos - startPos;
      onResize(delta);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = direction === "horizontal" ? "col-resize" : "row-resize";
    document.body.style.userSelect = "none";
  }, [direction, onResize]);

  return (
    <div
      className={cn(
        "flex-shrink-0 transition-colors relative group",
        direction === "horizontal" 
          ? "w-1 cursor-col-resize" 
          : "h-1 cursor-row-resize",
        "bg-[#3c3c3c] hover:bg-blue-500",
        isDragging && "bg-blue-500",
        className
      )}
      onMouseDown={handleMouseDown}
      onDoubleClick={onDoubleClick}
    >
      {/* Larger hit area for easier grabbing */}
      <div 
        className={cn(
          "absolute",
          direction === "horizontal" 
            ? "-left-1 -right-1 top-0 bottom-0" 
            : "left-0 right-0 -top-1 -bottom-1"
        )}
      />
    </div>
  );
}
