import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useHookHistory } from "@/hooks/useHookHistory";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  BarChart3, 
  TrendingUp, 
  Zap, 
  Trophy,
  Calendar,
  Trash2,
  LogOut,
  User
} from "lucide-react";

const getStrengthStyle = (strength: string) => {
  if (strength.includes("Scroll-Past")) return { text: "text-strength-weak", bg: "bg-strength-weak/10" };
  if (strength.includes("Pattern Break")) return { text: "text-strength-average", bg: "bg-strength-average/10" };
  if (strength.includes("Scroll-Stopping")) return { text: "text-strength-strong", bg: "bg-strength-strong/10" };
  if (strength.includes("Viral")) return { text: "text-strength-viral", bg: "bg-strength-viral/10" };
  return { text: "text-muted-foreground", bg: "bg-muted/10" };
};

const Profile = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { history, loading: historyLoading, deleteFromHistory, clearHistory } = useHookHistory();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // Calculate stats
  const totalTests = history.length;
  const averageScore = totalTests > 0 
    ? Math.round(history.reduce((sum, item) => sum + item.result.score, 0) / totalTests) 
    : 0;
  const highestScore = totalTests > 0 
    ? Math.max(...history.map(item => item.result.score)) 
    : 0;
  const viralCount = history.filter(item => item.result.strength.includes("Viral")).length;

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, { 
      month: "short", 
      day: "numeric",
      year: "numeric",
      hour: "2-digit", 
      minute: "2-digit" 
    });
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="container px-4 py-8 relative z-10 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={signOut} className="gap-2">
            <LogOut className="w-4 h-4" />
            Sign out
          </Button>
        </div>

        {/* Profile Header */}
        <div className="bg-card rounded-2xl shadow-card border border-border p-6 mb-6 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center">
              <User className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Your Profile</h1>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-card rounded-xl shadow-card border border-border p-5 animate-fade-in" style={{ animationDelay: "50ms" }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{totalTests}</p>
            <p className="text-sm text-muted-foreground">Hooks Tested</p>
          </div>

          <div className="bg-card rounded-xl shadow-card border border-border p-5 animate-fade-in" style={{ animationDelay: "100ms" }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-accent" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{averageScore}</p>
            <p className="text-sm text-muted-foreground">Average Score</p>
          </div>

          <div className="bg-card rounded-xl shadow-card border border-border p-5 animate-fade-in" style={{ animationDelay: "150ms" }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-strength-viral/10 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-strength-viral" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{highestScore}</p>
            <p className="text-sm text-muted-foreground">Best Score</p>
          </div>

          <div className="bg-card rounded-xl shadow-card border border-border p-5 animate-fade-in" style={{ animationDelay: "200ms" }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-strength-strong/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-strength-strong" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{viralCount}</p>
            <p className="text-sm text-muted-foreground">Viral Potential</p>
          </div>
        </div>

        {/* History Section */}
        <div className="bg-card rounded-2xl shadow-card border border-border p-6 animate-fade-in" style={{ animationDelay: "250ms" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <Calendar className="w-5 h-5 text-primary" />
              Hook History
            </h2>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors"
              >
                Clear all
              </button>
            )}
          </div>

          {historyLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-12">
              <Zap className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">No hooks tested yet</p>
              <Link to="/">
                <Button variant="gradient" size="sm" className="mt-4">
                  Test your first hook
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {history.map((item, index) => (
                <div
                  key={item.id}
                  className="group p-4 rounded-xl bg-secondary/50 border border-border/50 animate-fade-in"
                  style={{ animationDelay: `${300 + index * 50}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <div className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold ${getStrengthStyle(item.result.strength).bg} ${getStrengthStyle(item.result.strength).text}`}>
                      {item.result.score}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground line-clamp-2 mb-1">{item.hook}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getStrengthStyle(item.result.strength).bg} ${getStrengthStyle(item.result.strength).text}`}>
                          {item.result.strength}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(item.timestamp)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteFromHistory(item.id)}
                      className="shrink-0 p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
