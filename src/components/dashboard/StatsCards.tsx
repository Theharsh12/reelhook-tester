import { TrendingUp, Hash, Trophy } from "lucide-react";

interface StatsCardsProps {
  total: number;
  avgScore: number;
  bestScore: number;
}

export function StatsCards({ total, avgScore, bestScore }: StatsCardsProps) {
  const stats = [
    { label: "Hooks Analyzed", value: total, icon: Hash, color: "text-primary" },
    { label: "Average Score", value: avgScore, icon: TrendingUp, color: "text-strength-average" },
    { label: "Best Score", value: bestScore, icon: Trophy, color: "text-strength-viral" },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-card rounded-2xl border border-border p-4 sm:p-6 text-center animate-fade-in">
          <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
          <p className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</p>
          <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
