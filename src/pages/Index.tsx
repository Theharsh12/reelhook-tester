import { HookTester } from "@/components/HookTester";
import { Sparkles } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container px-4 py-12 md:py-20 relative z-10">
        {/* Header */}
        <header className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card border border-border shadow-soft mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-card-foreground">Reel Hook Analyzer</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 tracking-tight">
            Test Your <span className="gradient-text">Reel Hook</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Instantly know if your hook will stop the scroll
          </p>
        </header>

        {/* Main Content */}
        <main className="animate-slide-up" style={{ animationDelay: "100ms" }}>
          <HookTester />
        </main>

        {/* Footer */}
        <footer className="text-center mt-16 text-sm text-muted-foreground/60">
          <p>Built for creators who want to go viral</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;