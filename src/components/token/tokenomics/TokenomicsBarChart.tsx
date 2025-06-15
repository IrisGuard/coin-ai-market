
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

// ULTRA VIVID neon gradients:
const data = [
  { name: "Public Sale", value: 8000 },
  { name: "Team", value: 4000 },
  { name: "Ecosystem", value: 4000 },
  { name: "Marketing", value: 3000 },
  { name: "Rewards", value: 3000 },
];
const barGradients = [
  [
    { offset: "0%", color: "#00d4ff" },    // electric blue
    { offset: "68%", color: "#0070fa" },   // deep blue
    { offset: "100%", color: "#00ff88" },  // electric green
  ],
  [
    { offset: "0%", color: "#ff00cc" },    // neon magenta
    { offset: "70%", color: "#7c3aed" },   // vibrant purple
    { offset: "100%", color: "#ffd600" },  // ultra yellow
  ],
  [
    { offset: "0%", color: "#00ff88" },    // electric green
    { offset: "50%", color: "#00d4ff" },   // vivid blue
    { offset: "100%", color: "#2af7c0" },  // teal
  ],
  [
    { offset: "0%", color: "#ff0080" },    // neon pink
    { offset: "75%", color: "#fff600" },   // yellow
    { offset: "100%", color: "#00d4ff" },  // blue
  ],
  [
    { offset: "0%", color: "#ff6600" },    // orange
    { offset: "60%", color: "#ffd600" },   // yellow
    { offset: "100%", color: "#ff1744" },  // electric red
  ],
];

export function TokenomicsBarChart() {
  return (
    <ChartContainer
      config={{}}
      className="rounded-2xl bg-white shadow-xl border-2 border-[#00d4ff]/70 glass-card px-2 pt-5 pb-3 mx-auto max-w-lg animate-fade-in"
    >
      <>
        <ResponsiveContainer minWidth={300} minHeight={180} height={210}>
          <BarChart data={data} barCategoryGap="25%">
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontWeight: 700, fill: "#0070fa", fontSize: 14 }} />
            <YAxis hide />
            <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
            <Bar dataKey="value" radius={[18, 18, 6, 6]}>
              {data.map((_, i) => (
                <Cell
                  key={`cell-${i}`}
                  fill={`url(#bar-gradient-${i})`}
                  style={{
                    filter: "brightness(1.29) drop-shadow(0 0 14px #00d4ff)",
                    transition: "filter .24s"
                  }}
                />
              ))}
            </Bar>
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
        <div className="mt-1 text-center font-extrabold text-lg bg-gradient-to-r from-[#0070fa] via-[#ff00cc] to-[#00ff88] bg-clip-text text-transparent drop-shadow animate-glow uppercase tracking-wide">
          Token Distribution
        </div>
      </>
    </ChartContainer>
  );
}
