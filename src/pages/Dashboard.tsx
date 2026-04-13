import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { ScoreTrendChart } from "@/components/dashboard/ScoreTrendChart";
import { ScoreDistribution } from "@/components/dashboard/ScoreDistribution";

interface HookEntry {
  id: string;
  hook: string;
  score: number;
  strength: string;
  analyzed_at: string;
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [entries, setEntries] = useState<HookEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const { data } = await supabase
        .from("hook_history")
        .select("id, hook, score, strength, analyzed_at")
        .eq("user_id", user.id)
        .order("analyzed_at", { ascending: true });
      setEntries(data || []);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  if (authLoading || !user) return null;

  const avgScore = entries.length ? Math.round(entries.reduce((s, e) => s + e.score, 0) / entries.length) : 0;
  const bestScore = entries.length ? Math.max(...entries.map((e) => e.score)) : 0;

  return (
    <div className="min-h-screen bg-background noise">
      <div className="container max-w-4xl px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Link to="/">
            <Button variant="ghost" size="icon" className="rounded-full glass glass-border">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Your Dashboard</h1>
            <p className="text-sm text-muted-foreground">Track your hook performance over time</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <p className="text-muted-foreground">No hooks analyzed yet. Go analyze some hooks!</p>
            <Link to="/">
              <Button variant="gradient">Start Analyzing</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <StatsCards total={entries.length} avgScore={avgScore} bestScore={bestScore} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ScoreTrendChart entries={entries} />
              <ScoreDistribution entries={entries} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
