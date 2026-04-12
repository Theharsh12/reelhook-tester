import { Zap, Target, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant AI Feedback",
    description: "Get a score and brutal truth in seconds — no waiting around.",
    gradient: "from-primary to-accent",
  },
  {
    icon: Target,
    title: "Hook Type Detection",
    description: "Know exactly what type of hook you're using and whether it works.",
    gradient: "from-accent to-primary",
  },
  {
    icon: BarChart3,
    title: "Rewrite Suggestions",
    description: "Get 3 hook variations rewritten by AI to boost your engagement.",
    gradient: "from-primary via-accent to-primary",
  },
];

export function FeaturesSection() {
  return (
    <section className="mt-16 sm:mt-24 animate-fade-in px-2" style={{ animationDelay: "500ms" }}>
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Why creators use this</h2>
        <p className="text-xl sm:text-2xl font-bold text-foreground">Every feature you need. Nothing you don't.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 max-w-3xl mx-auto">
        {features.map((feature, i) => (
          <div
            key={i}
            className="group relative p-5 sm:p-6 rounded-2xl glass glass-border hover:border-primary/20 transition-all duration-300"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
              <feature.icon className="w-5 h-5 text-primary-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-1.5 text-sm sm:text-base">{feature.title}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
