
import * as React from "react";
import { Pie, PieChart, Sector, Cell, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartData = [
  { name: "Public Sale", value: 40 },
  { name: "Team & Advisors", value: 20 },
  { name: "Ecosystem & Dev", value: 20 },
  { name: "Marketing", value: 10 },
  { name: "Liquidity/Rewards", value: 10 },
];

// Strong, vibrant multi-color gradients for each slice:
const chartGradients = [
  {
    id: "pie-gcai-sky",
    stops: [
      { offset: "0%", color: "#0ea5e9" },   // sky-500
      { offset: "60%", color: "#2563eb" },  // blue-600
      { offset: "100%", color: "#38ffc7" }, // electric-green
    ],
  },
  {
    id: "pie-gcai-purple",
    stops: [
      { offset: "0%", color: "#9333ea" },   // purple-600
      { offset: "60%", color: "#e879f9" },  // fuchsia-400
      { offset: "100%", color: "#818cf8" }, // indigo-400
    ],
  },
  {
    id: "pie-gcai-green",
    stops: [
      { offset: "0%", color: "#10b981" },   // emerald-500
      { offset: "60%", color: "#22d3ee" },  // cyan-400
      { offset: "100%", color: "#38ffc7" }, // electric-green
    ],
  },
  {
    id: "pie-gcai-pink",
    stops: [
      { offset: "0%", color: "#f472b6" },   // pink-400
      { offset: "80%", color: "#f9a8d4" },  // pink-200
      { offset: "100%", color: "#818cf8" }, // indigo-400
    ],
  },
  {
    id: "pie-gcai-orange",
    stops: [
      { offset: "0%", color: "#f59e42" },   // custom vibrant orange
      { offset: "80%", color: "#fbbf24" },  // amber-400
      { offset: "100%", color: "#fd1d1d" }, // ultra-bright magenta-red
    ],
  }
];

export function SupplyChart() {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  return (
    <ChartContainer
      config={{}}
      className="rounded-2xl bg-white/95 dark:bg-white/80 shadow-xl border border-blue-100/80 glass-card mx-auto aspect-square max-w-xs md:max-w-[330px] p-2 flex items-center justify-center animate-fade-in"
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
              strokeWidth={5}
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
                        ? "drop-shadow(0 0 14px #2563eb) brightness(1.24)"
                        : undefined,
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
                fill="url(#pie-gcai-sky)"
                style={{ fontSize: "2.15rem" }}
              >
                {chartData[activeIndex].value}%
              </text>
            )}
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-2 text-center font-bold text-md bg-gradient-to-r from-blue-700 via-fuchsia-500 to-emerald-400 bg-clip-text text-transparent drop-shadow animate-glow uppercase tracking-wide">
          Supply Allocation
        </div>
      </>
    </ChartContainer>
  );
}
