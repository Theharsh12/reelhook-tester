import { HookTester } from "@/components/HookTester";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { Instagram, User, LogOut, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { user, signOut, loading } = useAuth();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      
      {/* Auth Header */}
      <div className="absolute top-4 right-4 z-20">
        {loading ? (
          <div className="w-8 h-8 animate-pulse bg-muted rounded-full" />
        ) : user ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/80 border border-border">
              <User className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground max-w-[120px] truncate">
                {user.email}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        ) : (
          <Link to="/auth">
            <Button variant="outline" size="sm" className="gap-2">
              <Sparkles className="w-4 h-4" />
              Sign in to save hooks
            </Button>
          </Link>
        )}
      </div>
      
      <div className="container px-4 py-12 md:py-20 relative z-10">
        {/* Header */}
        <header className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-6">
            <Instagram className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-secondary-foreground">Reel Creator Tool</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Test Your <span className="gradient-text">Reel Hook</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            See how scroll-stopping your hook really is
          </p>
          {!user && !loading && (
            <p className="text-sm text-primary/80 mt-2">
              Sign in to save your hook history across devices
            </p>
          )}
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
