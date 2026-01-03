import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface HookResult {
  score: number;
  strength: string;
  reasons: string[];
  suggestions: string[];
}

interface HistoryItem {
  id: string;
  hook: string;
  result: HookResult;
  timestamp: number;
}

const LOCAL_HISTORY_KEY = "hook-tester-history";
const MAX_HISTORY = 10;

export function useHookHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_HISTORY_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse local history:", e);
      }
    }
    setLoading(false);
  }, []);

  // Save to history
  const saveToHistory = async (hookText: string, hookResult: HookResult) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      hook: hookText,
      result: hookResult,
      timestamp: Date.now(),
    };
    const updated = [newItem, ...history].slice(0, MAX_HISTORY);
    setHistory(updated);
    localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(updated));
  };

  // Delete from history
  const deleteFromHistory = async (id: string) => {
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated);
    localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(updated));
  };

  // Clear all history
  const clearHistory = async () => {
    setHistory([]);
    localStorage.removeItem(LOCAL_HISTORY_KEY);
    toast({ title: "History cleared" });
  };

  return {
    history,
    loading,
    saveToHistory,
    deleteFromHistory,
    clearHistory,
  };
}
