import { HookTester } from "@/components/HookTester";
import { Instagram } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-12 md:py-20">
        {/* Header */}
        <header className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary mb-6">
            <Instagram className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-secondary-foreground">Reel Creator Tool</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Test Your <span className="gradient-text">Reel Hook</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            See how scroll-stopping your hook really is
          </p>
        </header>

        {/* Main Content */}
        <main className="animate-slide-up" style={{ animationDelay: "150ms" }}>
          <HookTester />
        </main>

        {/* Footer */}
        <footer className="text-center mt-16 text-sm text-muted-foreground">
          <p>Craft hooks that make viewers stop scrolling</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;