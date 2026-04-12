import { Instagram, Play } from "lucide-react";

export function HeroSection() {
  return (
    <header className="text-center pt-16 sm:pt-20 md:pt-28 pb-8 sm:pb-12 animate-fade-in">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass glass-border mb-6 sm:mb-8">
        <Instagram className="w-4 h-4 text-primary" aria-hidden="true" />
        <span className="text-xs sm:text-sm font-medium text-foreground/80">Reel Hook Analyzer</span>
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
      </div>

      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4 sm:mb-5 px-2 tracking-tight leading-[1.1]">
        Is your hook
        <br />
        <span className="gradient-text">scroll-stopping?</span>
      </h1>

      <h2 className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-lg mx-auto mb-6 sm:mb-8 px-4 leading-relaxed">
        AI-powered reel hook analysis for Instagram creators.
        <br className="hidden sm:block" />
        <span className="text-foreground/70">Free. Instant. No fluff.</span>
      </h2>

      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mb-2 sm:hidden">
        <span className="flex items-center gap-1.5">
          <Play className="w-3 h-3 text-primary" fill="currentColor" />
          Paste your hook
        </span>
        <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
        <span>Get scored</span>
      </div>

      <p className="text-xs sm:text-sm text-muted-foreground/60 max-w-xl mx-auto leading-relaxed px-4 hidden sm:block">
        Hooktester analyzes your reel hooks for clarity, curiosity, and emotional triggers — so every reel starts strong.
      </p>
    </header>
  );
}
