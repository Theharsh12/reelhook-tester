import { HookTester } from "@/components/HookTester";
import { Instagram, Zap, Target, BarChart3, ChevronDown } from "lucide-react";
import { useState } from "react";

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

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="container px-4 py-12 md:py-20 relative z-10">
        {/* Header */}
        <header className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-6">
            <Instagram className="w-4 h-4 text-accent" aria-hidden="true" />
            <span className="text-sm font-medium text-secondary-foreground">Reel Hook Analyzer</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Test Your <span className="gradient-text">Instagram</span> Reel <span className="gradient-text">Hook</span>
          </h1>
          <h2 className="text-lg text-muted-foreground max-w-lg mx-auto mb-6">
            Analyze if your reel hook is scroll-stopping or getting ignored
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Hooktester is a free Instagram reel hook tester that helps creators analyze their reel hooks in seconds. This reel hook analyzer checks clarity, curiosity, and relevance to improve Instagram reel engagement.
          </p>
        </header>

        {/* Main Content */}
        <main className="animate-slide-up" style={{ animationDelay: "150ms" }}>
          <HookTester />
        </main>

        {/* Trust Line */}
        <div className="text-center mt-10 animate-fade-in" style={{ animationDelay: "300ms" }}>
          <p className="text-sm text-muted-foreground">
            Built for Instagram creators, marketers, and coaches
          </p>
          <p className="text-xs text-muted-foreground/70 mt-3 max-w-md mx-auto">
            Use this hook analysis tool to understand why some Instagram reel hooks stop the scroll while others get ignored.
          </p>
        </div>

        {/* Features Section */}
        <section className="mt-20 animate-fade-in" style={{ animationDelay: "400ms" }}>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="text-center p-6 rounded-2xl bg-card/50 border border-border/50">
              <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Instant Analysis</h3>
              <p className="text-sm text-muted-foreground">Get AI-powered feedback in seconds</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-card/50 border border-border/50">
              <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Hook Type Detection</h3>
              <p className="text-sm text-muted-foreground">Identify what makes your hook work</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-card/50 border border-border/50">
              <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Score & Improve</h3>
              <p className="text-sm text-muted-foreground">Get specific suggestions to boost engagement</p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mt-20 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "500ms" }}>
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-card rounded-xl border border-border overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/30 transition-colors"
                >
                  <span className="font-medium text-foreground">{faq.question}</span>
                  <ChevronDown 
                    className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${
                      openFaq === index ? "rotate-180" : ""
                    }`} 
                  />
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-200 ${
                    openFaq === index ? "max-h-48" : "max-h-0"
                  }`}
                >
                  <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-24 pb-8 text-center">
          <p className="text-sm text-muted-foreground/60">
            © 2026 Hooktester · Instagram Reel Hook Analyzer for Creators
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
