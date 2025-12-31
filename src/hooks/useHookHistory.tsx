import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
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
  const { user } = useAuth();
  const { toast } = useToast();

  // Load history based on auth state
  const loadHistory = useCallback(async () => {
    setLoading(true);
    
    if (user) {
      // Load from database for authenticated users
      try {
        const { data, error } = await supabase
          .from("hook_history")
          .select("*")
          .order("analyzed_at", { ascending: false })
          .limit(MAX_HISTORY);

        if (error) throw error;

        const items: HistoryItem[] = (data || []).map((item) => ({
          id: item.id,
          hook: item.hook,
          result: {
            score: item.score,
            strength: item.strength,
            reasons: item.reasons,
            suggestions: item.suggestions,
          },
          timestamp: new Date(item.analyzed_at).getTime(),
        }));
        
        setHistory(items);
      } catch (error) {
        console.error("Failed to load history:", error);
        toast({
          title: "Failed to load history",
          description: "Your hook history couldn't be loaded.",
          variant: "destructive",
        });
      }
    } else {
      // Load from localStorage for unauthenticated users
      const saved = localStorage.getItem(LOCAL_HISTORY_KEY);
      if (saved) {
        try {
          setHistory(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse local history:", e);
        }
      }
    }
    
    setLoading(false);
  }, [user, toast]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // Save to history
  const saveToHistory = async (hookText: string, hookResult: HookResult) => {
    if (user) {
      // Save to database
      try {
        const { data, error } = await supabase
          .from("hook_history")
          .insert({
            user_id: user.id,
            hook: hookText,
            score: hookResult.score,
            strength: hookResult.strength,
            reasons: hookResult.reasons,
            suggestions: hookResult.suggestions,
          })
          .select()
          .single();

        if (error) throw error;

        const newItem: HistoryItem = {
          id: data.id,
          hook: hookText,
          result: hookResult,
          timestamp: new Date(data.analyzed_at).getTime(),
        };

        setHistory((prev) => [newItem, ...prev].slice(0, MAX_HISTORY));
      } catch (error) {
        console.error("Failed to save to history:", error);
        toast({
          title: "Failed to save",
          description: "Your hook couldn't be saved to history.",
          variant: "destructive",
        });
      }
    } else {
      // Save to localStorage
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        hook: hookText,
        result: hookResult,
        timestamp: Date.now(),
      };
      const updated = [newItem, ...history].slice(0, MAX_HISTORY);
      setHistory(updated);
      localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(updated));
    }
  };

  // Delete from history
  const deleteFromHistory = async (id: string) => {
    if (user) {
      try {
        const { error } = await supabase
          .from("hook_history")
          .delete()
          .eq("id", id);

        if (error) throw error;

        setHistory((prev) => prev.filter((item) => item.id !== id));
      } catch (error) {
        console.error("Failed to delete:", error);
        toast({
          title: "Failed to delete",
          description: "The hook couldn't be removed from history.",
          variant: "destructive",
        });
      }
    } else {
      const updated = history.filter((item) => item.id !== id);
      setHistory(updated);
      localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(updated));
    }
  };

  // Clear all history
  const clearHistory = async () => {
    if (user) {
      try {
        const { error } = await supabase
          .from("hook_history")
          .delete()
          .eq("user_id", user.id);

        if (error) throw error;

        setHistory([]);
        toast({ title: "History cleared" });
      } catch (error) {
        console.error("Failed to clear history:", error);
        toast({
          title: "Failed to clear",
          description: "History couldn't be cleared.",
          variant: "destructive",
        });
      }
    } else {
      setHistory([]);
      localStorage.removeItem(LOCAL_HISTORY_KEY);
      toast({ title: "History cleared" });
    }
  };

  // Migrate localStorage history to database on login
  const migrateLocalHistory = useCallback(async () => {
    if (!user) return;

    const saved = localStorage.getItem(LOCAL_HISTORY_KEY);
    if (!saved) return;

    try {
      const localHistory: HistoryItem[] = JSON.parse(saved);
      if (localHistory.length === 0) return;

      const items = localHistory.map((item) => ({
        user_id: user.id,
        hook: item.hook,
        score: item.result.score,
        strength: item.result.strength,
        reasons: item.result.reasons,
        suggestions: item.result.suggestions,
        analyzed_at: new Date(item.timestamp).toISOString(),
      }));

      const { error } = await supabase.from("hook_history").insert(items);

      if (!error) {
        localStorage.removeItem(LOCAL_HISTORY_KEY);
        toast({
          title: "History synced",
          description: `${localHistory.length} hooks have been saved to your account.`,
        });
        loadHistory();
      }
    } catch (error) {
      console.error("Failed to migrate history:", error);
    }
  }, [user, toast, loadHistory]);

  useEffect(() => {
    if (user) {
      migrateLocalHistory();
    }
  }, [user, migrateLocalHistory]);

  return {
    history,
    loading,
    saveToHistory,
    deleteFromHistory,
    clearHistory,
  };
}
