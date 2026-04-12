import { Eye, MessageCircle, Flame, Lightbulb, Clock } from "lucide-react";

const tips = [
  {
    icon: Eye,
    title: "Open With a Pattern Interrupt",
    body: "Start with something unexpected—a bold claim, a controversial take, or a visual that breaks the norm. \"Nobody talks about this…\" forces the brain to pause.",
    tag: "Attention",
  },
  {
    icon: MessageCircle,
    title: "Use a Curiosity Gap",
    body: "Tease what's coming without giving it away. \"The #1 mistake creators make\" creates an open loop the viewer needs to close.",
    tag: "Engagement",
  },
  {
    icon: Flame,
    title: "Lead With Emotion or Urgency",
    body: "Hooks that trigger FOMO, excitement, or surprise outperform neutral ones. \"You're losing followers because of this\" hits harder.",
    tag: "Emotion",
  },
  {
    icon: Lightbulb,
    title: "Make a Specific Promise",
    body: "Instead of \"How to grow on Instagram,\" try \"3 hooks that got me 1M views this month.\" Specificity signals value.",
    tag: "Value",
  },
  {
    icon: Clock,
    title: "Keep It Under 8 Words",
    body: "Viewers decide in under a second whether to stay. Edit ruthlessly: every word must earn its place.",
    tag: "Brevity",
  },
];

export function TipsSection() {
  return (
    <section className="mt-16 sm:mt-24 max-w-3xl mx-auto animate-fade-in px-2" style={{ animationDelay: "550ms" }}>
      <div className="text-center mb-8 sm:mb-10">
        <h2 className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Creator playbook</h2>
        <p className="text-xl sm:text-2xl font-bold text-foreground">How to Write Scroll-Stopping Hooks</p>
        <p className="text-xs sm:text-sm text-muted-foreground mt-2 max-w-md mx-auto">
          The first 1–3 seconds decide everything. Here's what top creators do differently.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {tips.map((tip, i) => (
          <article
            key={i}
            className={`group p-5 rounded-2xl glass glass-border hover:border-primary/15 transition-all duration-300 ${
              i === 4 ? "sm:col-span-2 sm:max-w-md sm:mx-auto" : ""
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <tip.icon className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground text-sm sm:text-base leading-tight">{tip.title}</h3>
              </div>
              <span className="text-[10px] font-medium text-primary/70 bg-primary/8 px-2 py-0.5 rounded-full shrink-0">
                {tip.tag}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{tip.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
