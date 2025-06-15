
import * as React from "react";
import { Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { name: "Public Sale", value: 40, fill: "var(--color-publicSale)" },
  { name: "Team & Advisors", value: 20, fill: "var(--color-team)" },
  { name: "Ecosystem & Dev", value: 20, fill: "var(--color-ecosystem)" },
  { name: "Marketing", value: 10, fill: "var(--color-marketing)" },
  { name: "Liquidity/Rewards", value: 10, fill: "var(--color-liquidity)" },
];

const chartConfig = {
  value: {
    label: "GCAI",
  },
  publicSale: {
    label: "Public Sale",
    color: "hsl(var(--chart-1))",
  },
  team: {
    label: "Team & Advisors",
    color: "hsl(var(--chart-2))",
  },
  ecosystem: {
    label: "Ecosystem & Dev",
    color: "hsl(var(--chart-3))",
  },
  marketing: {
    label: "Marketing",
    color: "hsl(var(--chart-4))",
  },
  liquidity: {
    label: "Liquidity/Rewards",
    color: "hsl(var(--chart-5))",
  },
};

export function SupplyChart() {
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[300px]"
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
          innerRadius={60}
          strokeWidth={5}
          activeIndex={0}
          activeShape={(props: PieSectorDataItem) => {
              const {
                cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent,
              } = props;
              const RADIAN = Math.PI / 180;
              const sin = Math.sin(-RADIAN * props.midAngle);
              const cos = Math.cos(-RADIAN * props.midAngle);
              const sx = cx + (outerRadius + 10) * cos;
              const sy = cy + (outerRadius + 10) * sin;
              const mx = cx + (outerRadius + 30) * cos;
              const my = cy + (outerRadius + 30) * sin;
              const ex = mx + (cos >= 0 ? 1 : -1) * 22;
              const ey = my;
              const textAnchor = cos >= 0 ? 'start' : 'end';

              return (
                <g>
                  <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                    className="stroke-border"
                  />
                  <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
                  <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
                  <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="hsl(var(--foreground))" className="text-sm">{`${payload.name}`}</text>
                  <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="hsl(var(--muted-foreground))" className="text-xs">
                    {`(${(percent * 100).toFixed(0)}%)`}
                  </text>
                </g>
              );
            }}
        />
      </PieChart>
    </ChartContainer>
  );
}
