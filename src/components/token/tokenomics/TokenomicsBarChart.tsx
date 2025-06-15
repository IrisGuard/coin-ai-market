
import * as React from "react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartData = [
  { period: "3M", apy: 15, color: "#00d4ff" },
  { period: "6M", apy: 25, color: "#0070fa" },
  { period: "12M", apy: 40, color: "#7c3aed" },
  { period: "18M", apy: 55, color: "#ff00cc" },
  { period: "24M", apy: 70, color: "#00ff88" },
  { period: "36M", apy: 100, color: "#ffd700" },
];

const chartConfig = {
  apy: {
    label: "APY %",
    color: "#00d4ff",
  },
};

export function TokenomicsBarChart() {
  return (
    <div className="w-full max-w-xs mx-auto">
      <div className="glass-card rounded-2xl bg-white shadow-xl border-2 border-[#00d4ff]/70 p-4 animate-fade-in">
        <div className="w-full h-48">
          <ChartContainer config={chartConfig}>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
              <XAxis 
                dataKey="period" 
                fontSize={11}
                className="font-bold"
                stroke="#0070fa"
              />
              <YAxis 
                fontSize={10}
                className="font-bold"
                stroke="#0070fa"
              />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                cursor={{ fill: 'rgba(0, 212, 255, 0.1)' }}
              />
              <Bar 
                dataKey="apy" 
                radius={[4, 4, 0, 0]}
                fill="url(#barGradient)"
              />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00d4ff" />
                  <stop offset="50%" stopColor="#0070fa" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
            </BarChart>
          </ChartContainer>
        </div>
        
        <div className="text-center mt-2">
          <h3 className="font-extrabold text-sm bg-gradient-to-r from-[#0070fa] via-[#00d4ff] to-[#7c3aed] bg-clip-text text-transparent animate-glow">
            Staking APY by Period
          </h3>
        </div>
      </div>
    </div>
  );
}
