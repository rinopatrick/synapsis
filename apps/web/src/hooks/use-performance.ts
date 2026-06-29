import { useEffect, useRef } from "react";

export function usePerformanceMonitor(componentName: string) {
  const renderCount = useRef(0);
  const lastRender = useRef(Date.now());

  useEffect(() => {
    renderCount.current++;
    const now = Date.now();
    const timeSinceLastRender = now - lastRender.current;
    lastRender.current = now;

    if (process.env.NODE_ENV === "development") {
      console.log(
        `[Performance] ${componentName}: render #${renderCount.current} (${timeSinceLastRender}ms since last)`
      );
    }
  });
}

export function useRenderCount(componentName: string) {
  const count = useRef(0);
  count.current++;
  return count.current;
}
