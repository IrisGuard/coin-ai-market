
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

// Example data for distribution over time or vesting release
const data = [
  { name: "Public Sale", value: 8000 },
  { name: "Team", value: 4000 },
  { name: "Ecosystem", value: 4000 },
  { name: "Marketing", value: 3000 },
  { name: "Rewards", value: 3000 },
];
const barGradients = [
  "from-sky-400 via-sky-300 to-cyan-400",
  "from-blue-500 via-indigo-400 to-purple-400",
  "from-green-400 via-emerald-300 to-teal-300",
  "from-purple-400 via-pink-400 to-rose-400",
  "from-orange-400 via-amber-300 to-yellow-400"
];

export function TokenomicsBarChart() {
  return (
    <ChartContainer
      config={{}}
      className="rounded-2xl bg-white/95 dark:bg-white/80 shadow-xl border border-blue-100/70 glass-card px-2 pt-5 pb-3 mx-auto max-w-lg animate-fade-in"
    >
      <ResponsiveContainer minWidth={300} minHeight={180} height={210}>
        <BarChart data={data} barCategoryGap="25%">
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontWeight: 600, fill: "#6366F1" }} />
          <YAxis hide />
          <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
          <Bar dataKey="value" radius={[18, 18, 6, 6]}>
            {data.map((_, i) => (
              <Cell
                key={`cell-${i}`}
                fill={`url(#bar-gradient-${i})`}
              />
            ))}
          </Bar>
          {/* SVG gradients for each bar */}
          <defs>
            {barGradients.map((tailwind, idx) => (
              <linearGradient id={`bar-gradient-${idx}`} key={idx} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={"#3b82f6"} stopOpacity={0.89 + idx * 0.02} />
                <stop offset="40%" stopColor={"#a21caf"} stopOpacity={0.77} />
                <stop offset="100%" stopColor={["#06b6d4","#7e22ce","#10b981","#db2777","#f59e42"][idx]} stopOpacity={0.93} />
              </linearGradient>
            ))}
          </defs>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-1 text-center font-semibold text-md bg-gradient-to-r from-sky-500 via-electric-purple to-emerald-400 bg-clip-text text-transparent drop-shadow animate-glow">
        Token Distribution (example values)
      </div>
    </ChartContainer>
  );
}
