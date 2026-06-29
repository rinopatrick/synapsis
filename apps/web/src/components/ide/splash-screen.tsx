"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Initializing...");
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const steps = [
      { progress: 20, status: "Loading core modules..." },
      { progress: 40, status: "Initializing AI engine..." },
      { progress: 60, status: "Loading workspace..." },
      { progress: 80, status: "Preparing editor..." },
      { progress: 100, status: "Ready!" },
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < steps.length) {
        setProgress(steps[current].progress);
        setStatus(steps[current].status);
        current++;
      } else {
        clearInterval(interval);
        setFadeOut(true);
        setTimeout(onComplete, 500);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] bg-[#1e1e1e] flex flex-col items-center justify-center transition-opacity duration-500",
        fadeOut ? "opacity-0" : "opacity-100"
      )}
    >
      {/* Logo */}
      <div className="mb-8 animate-pulse">
        <div className="text-8xl">🧠</div>
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold text-white mb-2">
        Synapsis <span className="text-blue-400">IDE</span>
      </h1>
      <p className="text-gray-400 mb-12">AI Learning IDE</p>

      {/* Progress bar */}
      <div className="w-64 h-1 bg-[#3c3c3c] rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Status */}
      <p className="text-sm text-gray-500">{status}</p>

      {/* Version */}
      <div className="absolute bottom-8 text-xs text-gray-600">
        v1.0.0
      </div>
    </div>
  );
}
