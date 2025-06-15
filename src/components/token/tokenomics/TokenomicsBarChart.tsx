
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

// Intense and lively color gradients
const data = [
  { name: "Public Sale", value: 8000 },
  { name: "Team", value: 4000 },
  { name: "Ecosystem", value: 4000 },
  { name: "Marketing", value: 3000 },
  { name: "Rewards", value: 3000 },
];
const barGradients = [
  [
    { offset: "0%", color: "#0ea5e9" },    // sky-500
    { offset: "60%", color: "#2563eb" },   // blue-600
    { offset: "100%", color: "#38ffc7" },  // electric-green
  ],
  [
    { offset: "0%", color: "#6366f1" },    // indigo-500
    { offset: "50%", color: "#a21caf" },   // violet-800
    { offset: "100%", color: "#818cf8" },  // indigo-400
  ],
  [
    { offset: "0%", color: "#22d3ee" },    // cyan-400
    { offset: "50%", color: "#10b981" },   // emerald-500
    { offset: "100%", color: "#38ffc7" },  // electric-green
  ],
  [
    { offset: "0%", color: "#c026d3" },    // fuchsia
    { offset: "50%", color: "#ec4899" },   // pink-500
    { offset: "100%", color: "#f9a8d4" },  // pink-200
  ],
  [
    { offset: "0%", color: "#f59e42" },    // vibrant orange
    { offset: "40%", color: "#fd1d1d" },   // magenta/red hot
    { offset: "100%", color: "#fbbf24" },  // amber-400
  ],
];

export function TokenomicsBarChart() {
  return (
    <ChartContainer
      config={{}}
      className="rounded-2xl bg-white/95 dark:bg-white/80 shadow-xl border border-blue-100/70 glass-card px-2 pt-5 pb-3 mx-auto max-w-lg animate-fade-in"
    >
      <>
        <ResponsiveContainer minWidth={300} minHeight={180} height={210}>
          <BarChart data={data} barCategoryGap="25%">
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontWeight: 700, fill: "#1e40af" }} />
            <YAxis hide />
            <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
            <Bar dataKey="value" radius={[18, 18, 6, 6]}>
              {data.map((_, i) => (
                <Cell
                  key={`cell-${i}`}
                  fill={`url(#bar-gradient-${i})`}
                  style={{
                    filter: "brightness(1.23)",
                    transition: "filter .22s"
                  }}
                />
              ))}
            </Bar>
            {/* SVG gradients for each bar */}
            <defs>
              {barGradients.map((stops, idx) => (
                <linearGradient id={`bar-gradient-${idx}`} key={idx} x1="0" y1="0" x2="0" y2="1">
                  {stops.map((stop, sidx) => (
                    <stop key={sidx} offset={stop.offset} stopColor={stop.color} />
                  ))}
                </linearGradient>
              ))}
            </defs>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-1 text-center font-bold text-md bg-gradient-to-r from-blue-700 via-fuchsia-500 to-emerald-400 bg-clip-text text-transparent drop-shadow animate-glow uppercase tracking-wide">
          Token Distribution (example values)
        </div>
      </>
    </ChartContainer>
  );
}
