import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Zap, TrendingUp, AlertCircle, Lightbulb } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface HookResult {
  score: number;
  strength: "Weak" | "Average" | "Strong" | "Viral-Potential";
  reasons: string[];
  suggestions: string[];
}

const getStrengthColor = (strength: HookResult["strength"]) => {
  switch (strength) {
    case "Weak": return "text-strength-weak";
    case "Average": return "text-strength-average";
    case "Strong": return "text-strength-strong";
    case "Viral-Potential": return "text-strength-viral";
  }
};

const getStrengthBg = (strength: HookResult["strength"]) => {
  switch (strength) {
    case "Weak": return "bg-strength-weak/10";
    case "Average": return "bg-strength-average/10";
    case "Strong": return "bg-strength-strong/10";
    case "Viral-Potential": return "bg-strength-viral/10";
  }
};

export function HookTester() {
  const [hook, setHook] = useState("");
  const [result, setResult] = useState<HookResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleTest = async () => {
    if (!hook.trim()) return;
    
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

      setResult(data as HookResult);
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

  return (
    <div className="w-full max-w-xl mx-auto">
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

          <Button
            variant="gradient"
            size="lg"
            onClick={handleTest}
            disabled={!hook.trim() || isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Zap />
                Test Hook
              </>
            )}
          </Button>
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
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getStrengthBg(result.strength)} ${getStrengthColor(result.strength)}`}>
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
                    className="p-4 rounded-xl bg-secondary/50 text-sm text-secondary-foreground animate-fade-in"
                    style={{ animationDelay: `${(index + 3) * 100}ms` }}
                  >
                    {suggestion}
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