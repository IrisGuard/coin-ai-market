
import * as React from "react";
import { Pie, PieChart, Sector, Cell, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

// ULTRA VIVID gradients for each slice:
const chartData = [
  { name: "Public Sale", value: 40 },
  { name: "Team & Advisors", value: 20 },
  { name: "Ecosystem & Dev", value: 20 },
  { name: "Marketing", value: 10 },
  { name: "Liquidity/Rewards", value: 10 },
];
// Neon bright gradients—pure, saturated color stops:
const chartGradients = [
  {
    id: "pie-gcai-electric-blue",
    stops: [
      { offset: "0%", color: "#00d4ff" },     // vivid electric blue
      { offset: "50%", color: "#0070fa" },    // deep blue
      { offset: "100%", color: "#00ff88" },   // electric green
    ],
  },
  {
    id: "pie-gcai-violet-neon",
    stops: [
      { offset: "0%", color: "#7c3aed" },     // electric purple
      { offset: "70%", color: "#ff00cc" },    // magenta neon
      { offset: "100%", color: "#ffd600" },   // pure yellow
    ],
  },
  {
    id: "pie-gcai-green-cyan",
    stops: [
      { offset: "0%", color: "#00ff88" },     // electric green
      { offset: "65%", color: "#2af7c0" },    // vibrant teal
      { offset: "100%", color: "#00d4ff" },   // pure cyan
    ],
  },
  {
    id: "pie-gcai-hot-pink",
    stops: [
      { offset: "0%", color: "#ff0080" },     // neon pink
      { offset: "60%", color: "#fff600" },    // neon yellow
      { offset: "100%", color: "#00d4ff" },   // blue
    ],
  },
  {
    id: "pie-gcai-orange-sun",
    stops: [
      { offset: "0%", color: "#ff6600" },     // orange
      { offset: "60%", color: "#ffd600" },    // bright yellow
      { offset: "100%", color: "#ff1744" },   // electric red
    ],
  }
];

export function SupplyChart() {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  return (
    <ChartContainer
      config={{}}
      className="rounded-2xl bg-white shadow-xl border-2 border-[#00d4ff]/70 glass-card mx-auto aspect-square max-w-xs md:max-w-[330px] p-2 flex items-center justify-center animate-fade-in"
    >
      <>
        <ResponsiveContainer width="100%" height={245}>
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={72}
              outerRadius={100}
              strokeWidth={6}
              onMouseEnter={(_, idx) => setActiveIndex(idx)}
              onMouseLeave={() => setActiveIndex(null)}
              isAnimationActive
            >
              {chartData.map((_, i) => (
                <Cell
                  key={chartGradients[i].id}
                  fill={`url(#${chartGradients[i].id})`}
                  style={{
                    filter:
                      activeIndex === i
                        ? "drop-shadow(0 0 22px #00d4ff) brightness(1.32)"
                        : "brightness(1.14)",
                    transition: "filter .28s"
                  }}
                />
              ))}
              {/* Gradients for each pie slice */}
              <defs>
                {chartGradients.map(g =>
                  <linearGradient id={g.id} key={g.id} x1="0" y1="1" x2="1" y2="0">
                    {g.stops.map((s, i) => (
                      <stop key={i} offset={s.offset} stopColor={s.color} />
                    ))}
                  </linearGradient>
                )}
              </defs>
            </Pie>
            {/* Animated big percentage in center when hovering */}
            {activeIndex !== null && (
              <text
                x="50%" y="50%" strokeWidth={0}
                dominantBaseline="middle"
                textAnchor="middle"
                className="font-extrabold pointer-events-none select-none"
                fill="url(#pie-gcai-electric-blue)"
                style={{
                  fontSize: "2.1rem",
                  textShadow: "0 0 8px #00d4ff, 0 0 1px #fff"
                }}
              >
                {chartData[activeIndex].value}%
              </text>
            )}
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-2 text-center font-bold text-md bg-gradient-to-r from-[#0070fa] via-[#ff00cc] to-[#00ff88] bg-clip-text text-transparent drop-shadow animate-glow uppercase tracking-wide">
          Supply Allocation
        </div>
      </>
    </ChartContainer>
  );
}
