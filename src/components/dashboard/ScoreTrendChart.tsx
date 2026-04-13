import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Entry {
  score: number;
  analyzed_at: string;
}

export function ScoreTrendChart({ entries }: { entries: Entry[] }) {
  const data = entries.map((e, i) => ({
    name: new Date(e.analyzed_at).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    score: e.score,
    index: i + 1,
  }));

  return (
    <div className="bg-card rounded-2xl border border-border p-5 sm:p-6 animate-fade-in">
      <h3 className="text-sm font-semibold text-foreground mb-4">Score Trend</h3>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={30} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "12px",
                fontSize: "12px",
              }}
            />
            <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3, fill: "hsl(var(--primary))" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
