import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Zap, TrendingUp, AlertCircle, Lightbulb, Copy, Check, History, Trash2, X, Share2, AlertTriangle, ArrowRight, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useHookHistory } from "@/hooks/useHookHistory";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/AuthModal";
import confetti from "canvas-confetti";

const FREE_LIMIT = 3;
const USAGE_KEY = "hook-analyze-count";

interface HookResult {
  score: number;
  verdict: string;
  brutalTruth: string[];
  whatsMissing: string;
  beforeAfter: {
    original: string;
    improved: string;
  };
  hookVariations: {
    pain: string;
    curiosity: string;
    relatable: string;
  };
  whenToUse: string;
  commonMistake: string;
}

const exampleHooks = [
  { label: "Curiosity", hook: "Nobody talks about this productivity hack that changed my life" },
  { label: "Problem", hook: "Stop wasting 3 hours every morning doing this" },
  { label: "Bold Claim", hook: "I made $10k in 30 days using this one strategy" },
  { label: "Question", hook: "Why do 90% of creators fail in their first year?" },
  { label: "Weak Example", hook: "Here are some tips for you" },
];

const getVerdictStyle = (verdict: string) => {
  if (verdict.includes("Likely to be Scrolled")) return { text: "text-strength-weak", bg: "bg-strength-weak/10" };
  if (verdict.includes("Weak Stopper")) return { text: "text-strength-average", bg: "bg-strength-average/10" };
  if (verdict.includes("Scroll-Stopping")) return { text: "text-strength-strong", bg: "bg-strength-strong/10" };
  if (verdict.includes("Viral-Ready")) return { text: "text-strength-viral", bg: "bg-strength-viral/10" };
  return { text: "text-muted-foreground", bg: "bg-muted/10" };
};

export function HookTester() {
  const [hook, setHook] = useState("");
  const [result, setResult] = useState<HookResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const { history, saveToHistory, deleteFromHistory, clearHistory, loading: historyLoading } = useHookHistory();

  // Load usage count from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(USAGE_KEY);
    if (stored) setUsageCount(parseInt(stored, 10) || 0);
  }, []);

  const triggerConfetti = useCallback(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 0.1, y: 0.6 },
      colors: ['#22c55e', '#4ade80', '#86efac', '#bbf7d0', '#dcfce7']
    });
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 0.9, y: 0.6 },
      colors: ['#22c55e', '#4ade80', '#86efac', '#bbf7d0', '#dcfce7']
    });
  }, []);

  const handleCopy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(key);
    toast({
      title: "Copied to clipboard",
      description: "Hook copied successfully",
    });
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleShare = async () => {
    if (!result) return;
    
    const shareText = `🎯 Hook Score: ${result.score}/100 - ${result.verdict}\n\n"${hook}"\n\nTest your reel hooks at:`;
    const shareUrl = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Hook Analysis",
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          copyShareLink(shareText, shareUrl);
        }
      }
    } else {
      copyShareLink(shareText, shareUrl);
    }
  };

  const copyShareLink = async (text: string, url: string) => {
    await navigator.clipboard.writeText(`${text}\n${url}`);
    toast({
      title: "Copied to clipboard",
      description: "Share text copied - paste it anywhere!",
    });
  };

  const handleTest = async () => {
    if (!hook.trim()) return;
    
    // Check if user needs to authenticate
    if (!user && usageCount >= FREE_LIMIT) {
      setShowAuthModal(true);
      return;
    }
    
    setIsAnalyzing(true);
    setResult(null);

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
      
      if (hookResult.score > 80) {
        triggerConfetti();
      }
      
      // Track usage for anonymous users
      if (!user) {
        const newCount = usageCount + 1;
        setUsageCount(newCount);
        localStorage.setItem(USAGE_KEY, newCount.toString());
      }
      
      // Save to history with compatible format
      await saveToHistory(hook.trim(), {
        score: hookResult.score,
        strength: hookResult.verdict,
        reasons: hookResult.brutalTruth,
        suggestions: [hookResult.hookVariations.pain, hookResult.hookVariations.curiosity, hookResult.hookVariations.relatable]
      });
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

  const loadFromHistory = (item: { hook: string; result: { score: number; strength: string; reasons: string[]; suggestions: string[] } }) => {
    setHook(item.hook);
    // Convert old format to new format for display
    setResult({
      score: item.result.score,
      verdict: item.result.strength,
      brutalTruth: item.result.reasons,
      whatsMissing: "Review this hook again for updated analysis.",
      beforeAfter: {
        original: item.hook,
        improved: item.result.suggestions[0] || ""
      },
      hookVariations: {
        pain: item.result.suggestions[0] || "",
        curiosity: item.result.suggestions[1] || "",
        relatable: item.result.suggestions[2] || ""
      },
      whenToUse: "Re-analyze for updated insights.",
      commonMistake: "⚠️ Re-analyze this hook for current insights."
    });
    setShowHistory(false);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const getHistoryVerdictStyle = (strength: string) => {
    if (strength.includes("Scrolled") || strength.includes("Scroll-Past")) return { text: "text-strength-weak", bg: "bg-strength-weak/10" };
    if (strength.includes("Weak") || strength.includes("Pattern Break")) return { text: "text-strength-average", bg: "bg-strength-average/10" };
    if (strength.includes("Stopping") || strength.includes("Scroll-Stopping")) return { text: "text-strength-strong", bg: "bg-strength-strong/10" };
    if (strength.includes("Viral")) return { text: "text-strength-viral", bg: "bg-strength-viral/10" };
    return { text: "text-muted-foreground", bg: "bg-muted/10" };
  };

  return (
    <div className="w-full max-w-xl mx-auto px-1 sm:px-0">
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
                  <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${getHistoryVerdictStyle(item.result.strength).bg} ${getHistoryVerdictStyle(item.result.strength).text}`}>
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
      <div className="bg-card rounded-2xl shadow-card border border-border p-5 sm:p-8">
        <div className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Paste your reel hook
            </label>
            <Textarea
              value={hook}
              onChange={(e) => setHook(e.target.value.slice(0, maxChars))}
              placeholder="e.g., Stop scrolling if you want to 10x your productivity..."
              className="min-h-[100px] sm:min-h-[120px] resize-none bg-secondary/50 border-0 focus-visible:ring-primary/20 focus-visible:ring-offset-0 text-sm sm:text-base placeholder:text-muted-foreground/60"
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
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {exampleHooks.map((example) => (
                <button
                  key={example.label}
                  onClick={() => handleExampleClick(example.hook)}
                  className="px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-medium rounded-full bg-secondary/70 text-secondary-foreground hover:bg-primary/20 hover:text-primary transition-colors border border-border/50"
                >
                  {example.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 sm:space-y-3">
            <div className="flex gap-2 sm:gap-3">
              <Button
                variant="gradient"
                size="lg"
                onClick={handleTest}
                disabled={!hook.trim() || isAnalyzing}
                className="flex-1 text-sm sm:text-base py-2.5 sm:py-3"
              >
                {isAnalyzing ? (
                  <>
                    <Sparkles className="animate-spin w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="ml-1.5">Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="ml-1.5">Analyze My Hook</span>
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowHistory(!showHistory)}
                className="shrink-0 relative px-3 sm:px-4"
              >
                <History className="w-4 h-4 sm:w-5 sm:h-5" />
                {history.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary text-primary-foreground text-[10px] sm:text-xs flex items-center justify-center">
                    {history.length}
                  </span>
                )}
              </Button>
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground text-center">
              No login • Free • Instant result
            </p>
          </div>
        </div>
      </div>

      {/* Results Card */}
      {result && !isAnalyzing && (
        <div className="mt-4 sm:mt-6 bg-card rounded-2xl shadow-card border border-border p-5 sm:p-8 animate-slide-up">
          {/* Verdict Section */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full gradient-bg mb-3 sm:mb-4">
              <span className="text-2xl sm:text-3xl font-bold text-primary-foreground">{result.score}</span>
            </div>
            <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
              <div className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full ${getVerdictStyle(result.verdict).bg} ${getVerdictStyle(result.verdict).text}`}>
                <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="font-semibold text-sm sm:text-base">{result.verdict}</span>
              </div>
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="font-medium text-xs sm:text-sm">Share</span>
              </button>
            </div>
          </div>

          <div className="space-y-5 sm:space-y-6">
            {/* Brutal Truth Section */}
            <div>
              <h3 className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-foreground mb-2 sm:mb-3">
                <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                Brutal Truth
              </h3>
              <ul className="space-y-1.5 sm:space-y-2">
                {result.brutalTruth.map((reason, index) => (
                  <li 
                    key={index} 
                    className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-primary mt-1.5 sm:mt-2 shrink-0" />
                    {reason}
                  </li>
                ))}
              </ul>
            </div>

            {/* What's Missing */}
            <div className="p-3 sm:p-4 rounded-xl bg-strength-average/10 border border-strength-average/20">
              <h3 className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-strength-average mb-1.5 sm:mb-2">
                <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                What's Missing
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">{result.whatsMissing}</p>
            </div>

            {/* Before → After */}
            <div className="pt-4 sm:pt-4 border-t border-border">
              <h3 className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-foreground mb-2 sm:mb-3">
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent" />
                Before → After Rewrite
              </h3>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-destructive/10">
                  <span className="text-destructive font-bold text-sm sm:text-base">❌</span>
                  <p className="text-xs sm:text-sm text-muted-foreground">{result.beforeAfter.original}</p>
                </div>
                <div className="group flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-strength-strong/10">
                  <span className="text-strength-strong font-bold text-sm sm:text-base">✅</span>
                  <p className="flex-1 text-xs sm:text-sm text-foreground font-medium">{result.beforeAfter.improved}</p>
                  <button
                    onClick={() => handleCopy(result.beforeAfter.improved, 'improved')}
                    className="shrink-0 p-1.5 sm:p-2 rounded-lg bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Copy improved hook"
                  >
                    {copiedIndex === 'improved' ? (
                      <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-strength-strong" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Hook Variations */}
            <div className="pt-4 sm:pt-4 border-t border-border">
              <h3 className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-foreground mb-2 sm:mb-3">
                <Lightbulb className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent" />
                3 Ready-to-Use Hook Variations
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {[
                  { key: 'pain', label: 'Pain Hook', value: result.hookVariations.pain },
                  { key: 'curiosity', label: 'Curiosity Hook', value: result.hookVariations.curiosity },
                  { key: 'relatable', label: 'Relatable Hook', value: result.hookVariations.relatable },
                ].map((variation, index) => (
                  <div 
                    key={variation.key}
                    className="group flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-secondary/50 animate-fade-in"
                    style={{ animationDelay: `${(index + 3) * 100}ms` }}
                  >
                    <span className="shrink-0 px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium rounded bg-primary/20 text-primary w-fit">
                      {variation.label}
                    </span>
                    <p className="flex-1 text-xs sm:text-sm text-secondary-foreground">{variation.value}</p>
                    <button
                      onClick={() => handleCopy(variation.value, variation.key)}
                      className="shrink-0 self-end sm:self-auto p-1.5 sm:p-2 rounded-lg bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={`Copy ${variation.label}`}
                    >
                      {copiedIndex === variation.key ? (
                        <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-strength-strong" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* When to Use & Warning */}
            <div className="pt-4 sm:pt-4 border-t border-border space-y-3 sm:space-y-4">
              <div className="p-3 sm:p-4 rounded-xl bg-primary/5 border border-primary/10">
                <h3 className="text-xs sm:text-sm font-semibold text-foreground mb-1">When to Use This Hook</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{result.whenToUse}</p>
              </div>
              <div className="p-3 sm:p-4 rounded-xl bg-strength-average/10 border border-strength-average/20">
                <p className="text-xs sm:text-sm text-strength-average font-medium">{result.commonMistake}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
