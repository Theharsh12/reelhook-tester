import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Zap, TrendingUp, AlertCircle, Lightbulb } from "lucide-react";

interface HookResult {
  score: number;
  strength: "Weak" | "Average" | "Strong" | "Viral-Potential";
  reasons: string[];
  suggestions: string[];
}

const analyzeHook = (hook: string): HookResult => {
  const trimmed = hook.trim();
  const words = trimmed.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  
  let score = 50;
  const reasons: string[] = [];
  const suggestions: string[] = [];

  // Check for question hooks
  if (trimmed.includes("?")) {
    score += 15;
    reasons.push("Questions create curiosity and engage viewers immediately");
  }

  // Check for numbers/statistics
  if (/\d+/.test(trimmed)) {
    score += 10;
    reasons.push("Specific numbers add credibility and capture attention");
  }

  // Check for power words
  const powerWords = ["secret", "never", "always", "stop", "why", "how", "shocking", "truth", "mistake", "hack", "free", "instantly", "proven", "guaranteed"];
  const foundPowerWords = powerWords.filter(word => trimmed.toLowerCase().includes(word));
  if (foundPowerWords.length > 0) {
    score += foundPowerWords.length * 8;
    reasons.push(`Uses attention-grabbing words: "${foundPowerWords.join(", ")}"`);
  }

  // Check for emotional triggers
  const emotionalWords = ["you", "your", "amazing", "incredible", "worst", "best", "love", "hate", "fear"];
  const foundEmotional = emotionalWords.filter(word => trimmed.toLowerCase().includes(word));
  if (foundEmotional.length > 0) {
    score += 10;
    reasons.push("Creates emotional connection with the viewer");
  }

  // Check for optimal length
  if (wordCount >= 5 && wordCount <= 12) {
    score += 10;
    reasons.push("Hook length is optimal for quick comprehension");
  } else if (wordCount < 5) {
    score -= 10;
    reasons.push("Hook might be too short to convey value");
  } else if (wordCount > 15) {
    score -= 15;
    reasons.push("Hook is too long - viewers may scroll past before finishing");
  }

  // Add negative reasons if score is low
  if (reasons.length < 2) {
    if (!trimmed.includes("?") && !trimmed.includes("!")) {
      reasons.push("Consider adding a question or exclamation to boost engagement");
    }
    if (foundPowerWords.length === 0) {
      reasons.push("Missing power words that create urgency or curiosity");
    }
  }

  // Cap score
  score = Math.min(100, Math.max(0, score));

  // Determine strength
  let strength: HookResult["strength"];
  if (score < 40) strength = "Weak";
  else if (score < 60) strength = "Average";
  else if (score < 80) strength = "Strong";
  else strength = "Viral-Potential";

  // Generate suggestions based on analysis
  if (!trimmed.includes("?")) {
    suggestions.push(`"Did you know ${trimmed.toLowerCase().replace(/[.!]$/, "")}?"`);
  }
  
  if (foundPowerWords.length === 0) {
    suggestions.push(`"The secret ${trimmed.toLowerCase().replace(/^(the |a |an )/i, "").replace(/[.!?]$/, "")} nobody talks about"`);
  } else {
    suggestions.push(`"${trimmed.replace(/[.!?]$/, "")} (and why it matters)"`);
  }

  return { score, strength, reasons: reasons.slice(0, 3), suggestions: suggestions.slice(0, 2) };
};

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

  const handleTest = async () => {
    if (!hook.trim()) return;
    
    setIsAnalyzing(true);
    // Simulate analysis time for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const analysis = analyzeHook(hook);
    setResult(analysis);
    setIsAnalyzing(false);
  };

  const charCount = hook.length;
  const maxChars = 200;

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Input Card */}
      <div className="bg-card rounded-2xl shadow-card p-8">
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
        <div className="mt-6 bg-card rounded-2xl shadow-card p-8 animate-slide-up">
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