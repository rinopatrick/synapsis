"use client";

import { useState, useEffect, useCallback } from "react";
import { useIDEStore } from "@/hooks/use-ide-store";

interface AutoSaveOptions {
  enabled: boolean;
  delay: number; // milliseconds
  onSave?: () => void;
}

export function useAutoSave(options: AutoSaveOptions = { enabled: true, delay: 1000 }) {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { addNotification } = useIDEStore();

  const save = useCallback(() => {
    if (!options.enabled) return;
    
    setIsSaving(true);
    
    // Simulate save
    setTimeout(() => {
      setLastSaved(new Date());
      setIsSaving(false);
      options.onSave?.();
    }, 100);
  }, [options]);

  // Auto-save on interval
  useEffect(() => {
    if (!options.enabled) return;

    const interval = setInterval(() => {
      save();
    }, options.delay);

    return () => clearInterval(interval);
  }, [options.enabled, options.delay, save]);

  // Save on Ctrl+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        save();
        addNotification("File saved", "success");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [save, addNotification]);

  return { lastSaved, isSaving, save };
}

export function AutoSaveIndicator() {
  const { lastSaved, isSaving } = useAutoSave({ enabled: true, delay: 30000 });

  if (isSaving) {
    return (
      <div className="flex items-center gap-1 text-xs text-gray-400">
        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
        <span>Saving...</span>
      </div>
    );
  }

  if (lastSaved) {
    return (
      <div className="flex items-center gap-1 text-xs text-gray-400">
        <div className="w-2 h-2 bg-green-400 rounded-full" />
        <span>Saved</span>
      </div>
    );
  }

  return null;
}
