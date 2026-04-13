import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface Entry {
  score: number;
  strength: string;
}

const categories = [
  { key: "Scrolled", label: "Scrolled Past", color: "hsl(var(--strength-weak))" },
  { key: "Weak", label: "Weak Stopper", color: "hsl(var(--strength-average))" },
  { key: "Stopping", label: "Scroll-Stopping", color: "hsl(var(--strength-strong))" },
  { key: "Viral", label: "Viral-Ready", color: "hsl(var(--strength-viral))" },
];

export function ScoreDistribution({ entries }: { entries: Entry[] }) {
  const data = categories.map((cat) => ({
    name: cat.label,
    count: entries.filter((e) => e.strength.includes(cat.key)).length,
    color: cat.color,
  }));

  return (
    <div className="bg-card rounded-2xl border border-border p-5 sm:p-6 animate-fade-in">
      <h3 className="text-sm font-semibold text-foreground mb-4">Verdict Breakdown</h3>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={25} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "12px",
                fontSize: "12px",
              }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
