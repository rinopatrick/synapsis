import { useState, useCallback, useEffect } from "react";

interface Package {
  name: string;
  version: string;
  description?: string;
  type: "npm" | "pip";
}

export function usePackages() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [manager, setManager] = useState<string>("unknown");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPackages = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/packages?action=list");
      const data = await response.json();
      setPackages(data.packages || []);
      setManager(data.manager || "unknown");
    } catch {
      setError("Failed to fetch packages");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const installPackage = useCallback(
    async (name: string) => {
      setIsLoading(true);
      try {
        await fetch("/api/packages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "install", package: name, manager }),
        });
        await fetchPackages();
      } finally {
        setIsLoading(false);
      }
    },
    [manager, fetchPackages]
  );

  const uninstallPackage = useCallback(
    async (name: string) => {
      setIsLoading(true);
      try {
        await fetch("/api/packages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "uninstall", package: name, manager }),
        });
        await fetchPackages();
      } finally {
        setIsLoading(false);
      }
    },
    [manager, fetchPackages]
  );

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  return {
    packages,
    manager,
    isLoading,
    error,
    installPackage,
    uninstallPackage,
    refresh: fetchPackages,
  };
}
