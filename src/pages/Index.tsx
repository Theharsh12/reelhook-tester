import { HookTester } from "@/components/HookTester";
import { AuthModal } from "@/components/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { Instagram, Zap, Target, BarChart3, ChevronDown, Lightbulb, MessageCircle, Eye, Flame, Clock, LogIn, LogOut, User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    question: "What is an Instagram reel hook?",
    answer: "An Instagram reel hook is the first 1-3 seconds of your video or the opening text overlay that captures attention. A strong hook stops viewers from scrolling and compels them to watch the rest of your content. It's the most critical element for reel performance."
  },
  {
    question: "How does this hook analyzer work?",
    answer: "Our AI analyzes your hook text for key scroll-stopping elements: curiosity gaps, emotional triggers, pattern interrupts, and clarity. It scores your hook from 0-100, identifies its type, and provides specific suggestions to make it more engaging."
  },
  {
    question: "Is this tool free to use?",
    answer: "Yes, this tool is completely free. No login required, no hidden fees. Just paste your hook and get instant AI-powered analysis to improve your Instagram reel performance."
  }
];

const Index = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Top-right auth button */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        {user ? (
          <Button variant="ghost" size="sm" onClick={signOut} className="gap-2">
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign out</span>
          </Button>
        ) : (
          <Button variant="outline" size="sm" onClick={() => setShowAuth(true)} className="gap-2">
            <LogIn className="w-4 h-4" />
            <span className="hidden sm:inline">Login / Sign up</span>
          </Button>
        )}
      </div>

      <AuthModal open={showAuth} onOpenChange={setShowAuth} />
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="container px-4 sm:px-6 py-8 sm:py-12 md:py-20 relative z-10">
        {/* Header */}
        <header className="text-center mb-8 sm:mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-secondary border border-border mb-4 sm:mb-6">
            <Instagram className="w-4 h-4 text-accent" aria-hidden="true" />
            <span className="text-xs sm:text-sm font-medium text-secondary-foreground">Reel Hook Analyzer</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4 px-2">
            Test Your <span className="gradient-text">Instagram</span> Reel <span className="gradient-text">Hook</span>
          </h1>
          <h2 className="text-base sm:text-lg text-muted-foreground max-w-lg mx-auto mb-4 sm:mb-6 px-4">
            Analyze if your reel hook is scroll-stopping or getting ignored
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed px-4 hidden sm:block">
            Hooktester is a free Instagram reel hook tester that helps creators analyze their reel hooks in seconds. This reel hook analyzer checks clarity, curiosity, and relevance to improve Instagram reel engagement.
          </p>
        </header>

        {/* Main Content */}
        <main className="animate-slide-up" style={{ animationDelay: "150ms" }}>
          <HookTester />
        </main>

        {/* Trust Line */}
        <div className="text-center mt-8 sm:mt-10 animate-fade-in px-4" style={{ animationDelay: "300ms" }}>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Built for Instagram creators, marketers, and coaches
          </p>
          <p className="text-xs text-muted-foreground/70 mt-2 sm:mt-3 max-w-md mx-auto hidden sm:block">
            Use this hook analysis tool to understand why some Instagram reel hooks stop the scroll while others get ignored.
          </p>
        </div>

        {/* Features Section */}
        <section className="mt-12 sm:mt-20 animate-fade-in px-2" style={{ animationDelay: "400ms" }}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto">
            <div className="text-center p-4 sm:p-6 rounded-2xl bg-card/50 border border-border/50">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full gradient-bg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-1 sm:mb-2 text-sm sm:text-base">Instant Analysis</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Get AI-powered feedback in seconds</p>
            </div>
            <div className="text-center p-4 sm:p-6 rounded-2xl bg-card/50 border border-border/50">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full gradient-bg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-1 sm:mb-2 text-sm sm:text-base">Hook Type Detection</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Identify what makes your hook work</p>
            </div>
            <div className="text-center p-4 sm:p-6 rounded-2xl bg-card/50 border border-border/50">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full gradient-bg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-1 sm:mb-2 text-sm sm:text-base">Score & Improve</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Get specific suggestions to boost engagement</p>
            </div>
          </div>
        </section>

        {/* Tips / Blog Section */}
        <section className="mt-12 sm:mt-20 max-w-3xl mx-auto animate-fade-in px-2" style={{ animationDelay: "450ms" }}>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground text-center mb-2 sm:mb-3">
            How to Write Scroll-Stopping Instagram Reel Hooks
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground text-center mb-6 sm:mb-8 max-w-xl mx-auto">
            The first 1–3 seconds of your reel decide whether someone watches or scrolls. Here are proven techniques top creators use to hook viewers instantly.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {[
              {
                icon: Eye,
                title: "Open With a Pattern Interrupt",
                body: "Start with something unexpected—a bold claim, a controversial take, or a visual that breaks the norm. \"Nobody talks about this…\" or \"Stop doing this immediately\" forces the brain to pause and pay attention."
              },
              {
                icon: MessageCircle,
                title: "Use a Curiosity Gap",
                body: "Tease what's coming without giving it away. Phrases like \"The #1 mistake creators make\" or \"I tried this for 30 days and…\" create an open loop the viewer needs to close by watching."
              },
              {
                icon: Flame,
                title: "Lead With Emotion or Urgency",
                body: "Hooks that trigger fear of missing out, excitement, or surprise outperform neutral ones. \"You're losing followers because of this\" hits harder than \"Here's a tip for growth.\""
              },
              {
                icon: Lightbulb,
                title: "Make a Specific Promise",
                body: "Vague hooks get ignored. Instead of \"How to grow on Instagram,\" try \"3 hooks that got me 1M views this month.\" Specificity signals value and builds trust instantly."
              },
              {
                icon: Clock,
                title: "Keep It Under 8 Words",
                body: "The best hooks are punchy and scannable. Viewers decide in under a second whether to stay—long sentences get lost. Edit ruthlessly: every word must earn its place."
              },
            ].map((tip, i) => (
              <article
                key={i}
                className={`p-4 sm:p-5 rounded-2xl bg-card/50 border border-border/50 ${i === 4 ? "sm:col-span-2 sm:max-w-md sm:mx-auto" : ""}`}
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center shrink-0">
                    <tip.icon className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm sm:text-base">{tip.title}</h3>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{tip.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mt-12 sm:mt-20 max-w-2xl mx-auto animate-fade-in px-2" style={{ animationDelay: "500ms" }}>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground text-center mb-6 sm:mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-2 sm:space-y-3">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-card rounded-xl border border-border overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-secondary/30 transition-colors gap-3"
                >
                  <span className="font-medium text-foreground text-sm sm:text-base">{faq.question}</span>
                  <ChevronDown 
                    className={`w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground transition-transform duration-200 shrink-0 ${
                      openFaq === index ? "rotate-180" : ""
                    }`} 
                  />
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-200 ${
                    openFaq === index ? "max-h-48" : "max-h-0"
                  }`}
                >
                  <p className="px-4 sm:px-5 pb-4 sm:pb-5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 sm:mt-24 pb-6 sm:pb-8 text-center px-4">
          <p className="text-xs sm:text-sm text-muted-foreground/60">
            © 2026 Hooktester · Instagram Reel Hook Analyzer for Creators
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
