
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Coins,
  Target,
  BarChart3
} from 'lucide-react';

interface DashboardStatsGridProps {
  stats: {
    totalValue: number;
    totalCoins: number;
    profitLoss: number;
    profitPercentage: number;
  };
}

const DashboardStatsGrid = ({ stats }: DashboardStatsGridProps) => {
  const statsCards = [
    {
      title: "Portfolio Value",
      value: `$${stats.totalValue.toLocaleString()}`,
      change: `+${stats.profitPercentage.toFixed(1)}%`,
      trend: stats.profitPercentage > 0 ? "up" : "down",
      icon: <DollarSign className="w-6 h-6" />,
      color: "text-green-600"
    },
    {
      title: "Total Coins",
      value: stats.totalCoins.toString(),
      change: "+12 this month",
      trend: "up",
      icon: <Coins className="w-6 h-6" />,
      color: "text-blue-600"
    },
    {
      title: "Profit/Loss",
      value: `$${Math.abs(stats.profitLoss).toLocaleString()}`,
      change: stats.profitLoss > 0 ? "Profit" : "Loss",
      trend: stats.profitLoss > 0 ? "up" : "down",
      icon: stats.profitLoss > 0 ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />,
      color: stats.profitLoss > 0 ? "text-green-600" : "text-red-600"
    },
    {
      title: "Performance",
      value: "Strong",
      change: "Above average",
      trend: "up",
      icon: <BarChart3 className="w-6 h-6" />,
      color: "text-purple-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={stat.color}>
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-2 mt-2">
                {stat.trend === "up" ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-xs ${
                  stat.trend === "up" ? "text-green-600" : "text-red-600"
                }`}>
                  {stat.change}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardStatsGrid;
