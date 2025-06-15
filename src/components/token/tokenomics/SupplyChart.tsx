
import * as React from "react";
import { Pie, PieChart, Cell } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartData = [
  { name: "Public Sale", value: 40, color: "#00d4ff" },
  { name: "Team & Advisors", value: 20, color: "#7c3aed" },
  { name: "Ecosystem & Dev", value: 20, color: "#00ff88" },
  { name: "Marketing", value: 10, color: "#ff00cc" },
  { name: "Liquidity/Rewards", value: 10, color: "#ff6600" },
];

const chartConfig = {
  value: {
    label: "Percentage",
  },
  "Public Sale": {
    label: "Public Sale",
    color: "#00d4ff",
  },
  "Team & Advisors": {
    label: "Team & Advisors",
    color: "#7c3aed",
  },
  "Ecosystem & Dev": {
    label: "Ecosystem & Dev", 
    color: "#00ff88",
  },
  "Marketing": {
    label: "Marketing",
    color: "#ff00cc",
  },
  "Liquidity/Rewards": {
    label: "Liquidity/Rewards",
    color: "#ff6600",
  },
};

export function SupplyChart() {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  return (
    <div className="w-full max-w-xs mx-auto">
      <div className="glass-card rounded-2xl bg-white shadow-xl border-2 border-[#00d4ff]/70 p-4 animate-fade-in">
        <div className="w-full h-64 relative">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip 
                cursor={false} 
                content={<ChartTooltipContent hideLabel />} 
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={85}
                strokeWidth={3}
                stroke="#ffffff"
                onMouseEnter={(_, idx) => setActiveIndex(idx)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    style={{
                      filter: activeIndex === index 
                        ? "drop-shadow(0 0 15px currentColor) brightness(1.3)" 
                        : "brightness(1.1)",
                      transition: "filter 0.3s ease"
                    }}
                  />
                ))}
              </Pie>
              
              {/* Center text when hovering */}
              {activeIndex !== null && (
                <text
                  x="50%" 
                  y="50%" 
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="font-extrabold text-2xl"
                  fill={chartData[activeIndex].color}
                  style={{
                    textShadow: `0 0 10px ${chartData[activeIndex].color}`,
                    filter: "drop-shadow(0 0 5px rgba(255,255,255,0.8))"
                  }}
                >
                  {chartData[activeIndex].value}%
                </text>
              )}
            </PieChart>
          </ChartContainer>
        </div>
        
        <div className="text-center mt-3">
          <h3 className="font-extrabold text-lg bg-gradient-to-r from-[#0070fa] via-[#00d4ff] to-[#00ff88] bg-clip-text text-transparent animate-glow">
            Supply Allocation
          </h3>
        </div>
      </div>
    </div>
  );
}
