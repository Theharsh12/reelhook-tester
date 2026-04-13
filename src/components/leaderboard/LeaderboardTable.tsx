import { Trophy } from "lucide-react";

interface PublicHook {
  id: string;
  hook: string;
  score: number;
  verdict: string;
  shared_at: string;
  profiles: { email: string | null } | null;
}

const getVerdictStyle = (verdict: string) => {
  if (verdict.includes("Scrolled")) return "text-strength-weak bg-strength-weak/10";
  if (verdict.includes("Weak")) return "text-strength-average bg-strength-average/10";
  if (verdict.includes("Stopping")) return "text-strength-strong bg-strength-strong/10";
  if (verdict.includes("Viral")) return "text-strength-viral bg-strength-viral/10";
  return "text-muted-foreground bg-muted/10";
};

const anonymize = (email: string | null | undefined) => {
  if (!email) return "Anonymous";
  const [name] = email.split("@");
  if (name.length <= 2) return name[0] + "***";
  return name[0] + name[1] + "***";
};

const medalColors = ["text-strength-viral", "text-muted-foreground", "text-strength-average"];

export function LeaderboardTable({ hooks }: { hooks: PublicHook[] }) {
  return (
    <div className="space-y-3">
      {hooks.map((hook, index) => (
        <div
          key={hook.id}
          className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 bg-card rounded-2xl border border-border animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="shrink-0 w-8 text-center">
            {index < 3 ? (
              <Trophy className={`w-5 h-5 mx-auto ${medalColors[index]}`} />
            ) : (
              <span className="text-sm font-bold text-muted-foreground">{index + 1}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground leading-snug">{hook.hook}</p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getVerdictStyle(hook.verdict)}`}>
                {hook.verdict}
              </span>
              <span className="text-xs text-muted-foreground">
                by {anonymize(hook.profiles?.email)}
              </span>
            </div>
          </div>
          <div className="shrink-0 w-12 h-12 rounded-full gradient-bg flex items-center justify-center">
            <span className="text-sm font-bold text-primary-foreground">{hook.score}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
