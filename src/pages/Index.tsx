import { HookTester } from "@/components/HookTester";
import { AuthModal } from "@/components/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, LogOut } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { TipsSection } from "@/components/landing/TipsSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { Footer } from "@/components/landing/Footer";

const Index = () => {
  const [showAuth, setShowAuth] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden noise">
      {/* Auth button */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        {user ? (
          <Button variant="ghost" size="sm" onClick={signOut} className="gap-2 glass glass-border rounded-full px-4">
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign out</span>
          </Button>
        ) : (
          <Button variant="outline" size="sm" onClick={() => setShowAuth(true)} className="gap-2 glass glass-border rounded-full px-4 hover:bg-primary/10 hover:border-primary/30 transition-all">
            <LogIn className="w-4 h-4" />
            <span className="hidden sm:inline">Login / Sign up</span>
          </Button>
        )}
      </div>

      <AuthModal open={showAuth} onOpenChange={setShowAuth} />

      {/* Background effects */}
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-primary/8 blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] rounded-full bg-accent/6 blur-[100px] animate-pulse-slow" style={{ animationDelay: "2s" }} />

      <div className="container px-4 sm:px-6 relative z-10">
        <HeroSection />

        {/* Main Tool */}
        <main className="animate-slide-up" style={{ animationDelay: "200ms" }}>
          <HookTester />
        </main>

        {/* Social proof */}
        <div className="text-center mt-8 sm:mt-10 animate-fade-in" style={{ animationDelay: "400ms" }}>
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass glass-border">
            <div className="flex -space-x-2">
              {["🎬", "🎯", "🚀"].map((emoji, i) => (
                <div key={i} className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-xs border-2 border-background">
                  {emoji}
                </div>
              ))}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Trusted by <span className="text-foreground font-medium">creators & marketers</span>
            </p>
          </div>
        </div>

        <FeaturesSection />
        <TipsSection />
        <FaqSection />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
