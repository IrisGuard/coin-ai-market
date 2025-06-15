
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

// Define unique gradient ids & colors for each slice
const chartGradients = [
  {
    id: "pie-gcai-sky",
    stops: [
      { offset: "0%", color: "#38bdf8" },
      { offset: "60%", color: "#818cf8" },
      { offset: "100%", color: "#22d3ee" }
    ],
  },
  {
    id: "pie-gcai-purple",
    stops: [
      { offset: "0%", color: "#c026d3" },
      { offset: "60%", color: "#e879f9" },
      { offset: "100%", color: "#7c3aed" }
    ],
  },
  {
    id: "pie-gcai-green",
    stops: [
      { offset: "0%", color: "#10b981" },
      { offset: "60%", color: "#a7f3d0" },
      { offset: "100%", color: "#22d3ee" }
    ],
  },
  {
    id: "pie-gcai-pink",
    stops: [
      { offset: "0%", color: "#f472b6" },
      { offset: "80%", color: "#f9a8d4" },
      { offset: "100%", color: "#818cf8" }
    ],
  },
  {
    id: "pie-gcai-orange",
    stops: [
      { offset: "0%", color: "#fbbf24" },
      { offset: "100%", color: "#ec4899" }
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
                      ? "drop-shadow(0 0 12px #3b82f6af) brightness(1.14)"
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
              className="font-bold pointer-events-none select-none"
              fill="url(#pie-gcai-sky)"
              style={{ fontSize: "2rem" }}
            >
              {chartData[activeIndex].value}%
            </text>
          )}
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-2 text-center font-semibold text-md bg-gradient-to-r from-sky-500 via-electric-purple to-emerald-400 bg-clip-text text-transparent drop-shadow animate-glow">
        Supply Allocation
      </div>
    </ChartContainer>
  );
}
