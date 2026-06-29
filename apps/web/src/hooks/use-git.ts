import { useState, useCallback, useEffect } from "react";

interface GitFile {
  status: string;
  path: string;
}

interface GitCommit {
  hash: string;
  message: string;
  author: string;
  date: string;
}

export function useGit() {
  const [files, setFiles] = useState<GitFile[]>([]);
  const [branch, setBranch] = useState("");
  const [commits, setCommits] = useState<GitCommit[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStatus = useCallback(async () => {
    try {
      const response = await fetch("/api/git?action=status");
      const data = await response.json();
      setFiles(data.files || []);
    } catch (error) {
      console.error("Failed to fetch git status:", error);
    }
  }, []);

  const fetchBranch = useCallback(async () => {
    try {
      const response = await fetch("/api/git?action=branch");
      const data = await response.json();
      setBranch(data.branch || "");
    } catch (error) {
      console.error("Failed to fetch branch:", error);
    }
  }, []);

  const fetchLog = useCallback(async () => {
    try {
      const response = await fetch("/api/git?action=log");
      const data = await response.json();
      setCommits(data.commits || []);
    } catch (error) {
      console.error("Failed to fetch log:", error);
    }
  }, []);

  const stageFiles = useCallback(
    async (files: string[]) => {
      setIsLoading(true);
      try {
        await fetch("/api/git", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "add", files }),
        });
        await fetchStatus();
      } finally {
        setIsLoading(false);
      }
    },
    [fetchStatus]
  );

  const commit = useCallback(
    async (message: string) => {
      setIsLoading(true);
      try {
        await fetch("/api/git", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "commit", message }),
        });
        await fetchStatus();
        await fetchLog();
      } finally {
        setIsLoading(false);
      }
    },
    [fetchStatus, fetchLog]
  );

  const push = useCallback(async () => {
    setIsLoading(true);
    try {
      await fetch("/api/git", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "push" }),
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const pull = useCallback(async () => {
    setIsLoading(true);
    try {
      await fetch("/api/git", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "pull" }),
      });
      await fetchStatus();
      await fetchLog();
    } finally {
      setIsLoading(false);
    }
  }, [fetchStatus, fetchLog]);

  useEffect(() => {
    fetchStatus();
    fetchBranch();
    fetchLog();
  }, [fetchStatus, fetchBranch, fetchLog]);

  return {
    files,
    branch,
    commits,
    isLoading,
    stageFiles,
    commit,
    push,
    pull,
    refresh: () => {
      fetchStatus();
      fetchBranch();
      fetchLog();
    },
  };
}
