import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Zap, TrendingUp, AlertCircle, Lightbulb, Copy, Check, History, Trash2, X, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useHookHistory } from "@/hooks/useHookHistory";

const DAILY_FREE_LIMIT = 3;
const STORAGE_KEY = "hook_tester_usage";

interface UsageData {
  date: string;
  count: number;
}

function getUsageData(): UsageData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored) as UsageData;
      const today = new Date().toDateString();
      if (data.date === today) {
        return data;
      }
    }
  } catch (e) {
    // Ignore parse errors
  }
  return { date: new Date().toDateString(), count: 0 };
}

function incrementUsage(): UsageData {
  const data = getUsageData();
  data.count += 1;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data;
}

function getRemainingTests(): number {
  const data = getUsageData();
  return Math.max(0, DAILY_FREE_LIMIT - data.count);
}

interface HookResult {
  score: number;
  strength: string;
  reasons: string[];
  suggestions: string[];
}

const exampleHooks = [
  { label: "Curiosity", hook: "Nobody talks about this productivity hack that changed my life" },
  { label: "Problem", hook: "Stop wasting 3 hours every morning doing this" },
  { label: "Bold Claim", hook: "I made $10k in 30 days using this one strategy" },
  { label: "Question", hook: "Why do 90% of creators fail in their first year?" },
  { label: "Weak Example", hook: "Here are some tips for you" },
];

const getStrengthStyle = (strength: string) => {
  if (strength.includes("Scroll-Past")) return { text: "text-strength-weak", bg: "bg-strength-weak/10" };
  if (strength.includes("Pattern Break")) return { text: "text-strength-average", bg: "bg-strength-average/10" };
  if (strength.includes("Scroll-Stopping")) return { text: "text-strength-strong", bg: "bg-strength-strong/10" };
  if (strength.includes("Viral")) return { text: "text-strength-viral", bg: "bg-strength-viral/10" };
  return { text: "text-muted-foreground", bg: "bg-muted/10" };
};

export function HookTester() {
  const [hook, setHook] = useState("");
  const [result, setResult] = useState<HookResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [remainingTests, setRemainingTests] = useState(getRemainingTests);
  const [limitReached, setLimitReached] = useState(false);
  const { toast } = useToast();
  const { history, saveToHistory, deleteFromHistory, clearHistory, loading: historyLoading } = useHookHistory();

  const handleCopy = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast({
      title: "Copied to clipboard",
      description: "Hook suggestion copied successfully",
    });
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleTest = async () => {
    if (!hook.trim()) return;
    
    // Check daily limit
    const remaining = getRemainingTests();
    if (remaining <= 0) {
      setLimitReached(true);
      return;
    }
    
    setIsAnalyzing(true);
    setResult(null);
    setLimitReached(false);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-hook', {
        body: { hook: hook.trim() }
      });

      if (error) {
        throw new Error(error.message || 'Failed to analyze hook');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      const hookResult = data as HookResult;
      setResult(hookResult);
      
      // Track usage
      incrementUsage();
      setRemainingTests(getRemainingTests());
      
      await saveToHistory(hook.trim(), hookResult);
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const charCount = hook.length;
  const maxChars = 200;

  const handleExampleClick = (exampleHook: string) => {
    setHook(exampleHook);
    setResult(null);
  };

  const loadFromHistory = (item: { hook: string; result: HookResult }) => {
    setHook(item.hook);
    setResult(item.result);
    setShowHistory(false);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* History Panel */}
      {showHistory && (
        <div className="mb-6 bg-card rounded-2xl shadow-card border border-border p-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <History className="w-4 h-4 text-primary" />
              Hook History
            </h3>
            <div className="flex items-center gap-2">
              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={() => setShowHistory(false)}
                className="p-1 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>
          {historyLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          ) : history.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No hooks analyzed yet</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-center gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary/70 transition-colors cursor-pointer"
                  onClick={() => loadFromHistory(item)}
                >
                  <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${getStrengthStyle(item.result.strength).bg} ${getStrengthStyle(item.result.strength).text}`}>
                    {item.result.score}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">{item.hook}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(item.timestamp)}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFromHistory(item.id);
                    }}
                    className="shrink-0 p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Input Card */}
      <div className="bg-card rounded-2xl shadow-card border border-border p-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Paste your reel hook
            </label>
            <Textarea
              value={hook}
              onChange={(e) => setHook(e.target.value.slice(0, maxChars))}
              placeholder="e.g., Stop scrolling if you want to 10x your productivity..."
              className="min-h-[120px] resize-none bg-secondary/50 border-0 focus-visible:ring-primary/20 focus-visible:ring-offset-0 text-base placeholder:text-muted-foreground/60"
            />
            <div className="flex justify-end">
              <span className={`text-xs font-medium ${charCount >= maxChars ? "text-destructive" : "text-muted-foreground"}`}>
                {charCount}/{maxChars}
              </span>
            </div>
          </div>

          {/* Example Hooks */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Try an example:</p>
            <div className="flex flex-wrap gap-2">
              {exampleHooks.map((example) => (
                <button
                  key={example.label}
                  onClick={() => handleExampleClick(example.hook)}
                  className="px-3 py-1.5 text-xs font-medium rounded-full bg-secondary/70 text-secondary-foreground hover:bg-primary/20 hover:text-primary transition-colors border border-border/50"
                >
                  {example.label}
                </button>
              ))}
            </div>
          </div>

          {/* Limit Reached Message */}
          {limitReached && (
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 animate-fade-in">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    You've used all {DAILY_FREE_LIMIT} free tests for today!
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Come back tomorrow for more free tests.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              variant="gradient"
              size="lg"
              onClick={handleTest}
              disabled={!hook.trim() || isAnalyzing || limitReached}
              className="flex-1"
            >
            {isAnalyzing ? (
              <>
                <Sparkles className="animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Zap />
                Test Hook ({remainingTests} left today)
              </>
              )}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowHistory(!showHistory)}
              className="shrink-0 relative"
            >
              <History className="w-5 h-5" />
              {history.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {history.length}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Results Card */}
      {result && !isAnalyzing && (
        <div className="mt-6 bg-card rounded-2xl shadow-card border border-border p-8 animate-slide-up">
          {/* Score Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full gradient-bg mb-4">
              <span className="text-3xl font-bold text-primary-foreground">{result.score}</span>
            </div>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getStrengthStyle(result.strength).bg} ${getStrengthStyle(result.strength).text}`}>
              <TrendingUp className="w-4 h-4" />
              <span className="font-semibold">{result.strength}</span>
            </div>
          </div>

          {/* Reasons Section */}
          <div className="space-y-6">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                <AlertCircle className="w-4 h-4 text-primary" />
                Analysis
              </h3>
              <ul className="space-y-2">
                {result.reasons.map((reason, index) => (
                  <li 
                    key={index} 
                    className="flex items-start gap-3 text-sm text-muted-foreground animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    {reason}
                  </li>
                ))}
              </ul>
            </div>

            {/* Suggestions Section */}
            <div className="pt-4 border-t border-border">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                <Lightbulb className="w-4 h-4 text-accent" />
                Improved Hooks
              </h3>
              <div className="space-y-3">
                {result.suggestions.map((suggestion, index) => (
                  <div 
                    key={index}
                    className="group flex items-start gap-3 p-4 rounded-xl bg-secondary/50 animate-fade-in"
                    style={{ animationDelay: `${(index + 3) * 100}ms` }}
                  >
                    <p className="flex-1 text-sm text-secondary-foreground">{suggestion}</p>
                    <button
                      onClick={() => handleCopy(suggestion, index)}
                      className="shrink-0 p-2 rounded-lg bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Copy suggestion"
                    >
                      {copiedIndex === index ? (
                        <Check className="w-4 h-4 text-strength-strong" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
