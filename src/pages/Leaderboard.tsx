import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy, TrendingUp } from "lucide-react";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";

interface PublicHook {
  id: string;
  hook: string;
  score: number;
  verdict: string;
  shared_at: string;
  user_id: string;
  profiles: { email: string | null } | null;
}

export default function Leaderboard() {
  const [hooks, setHooks] = useState<PublicHook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHooks = async () => {
      const { data } = await supabase
        .from("public_hooks")
        .select("*, profiles(email)")
        .order("score", { ascending: false })
        .limit(50);
      setHooks((data as unknown as PublicHook[]) || []);
      setLoading(false);
    };
    fetchHooks();
  }, []);

  return (
    <div className="min-h-screen bg-background noise">
      <div className="container max-w-3xl px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Link to="/">
            <Button variant="ghost" size="icon" className="rounded-full glass glass-border">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Trophy className="w-6 h-6 text-strength-viral" />
              Community Leaderboard
            </h1>
            <p className="text-sm text-muted-foreground">Top hooks shared by creators</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        ) : hooks.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground">No hooks shared yet. Be the first!</p>
            <Link to="/">
              <Button variant="gradient">Analyze a Hook</Button>
            </Link>
          </div>
        ) : (
          <LeaderboardTable hooks={hooks} />
        )}
      </div>
    </div>
  );
}
