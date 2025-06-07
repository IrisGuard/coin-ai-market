
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Package,
  Eye,
  DollarSign,
  TrendingUp
} from 'lucide-react';

interface StatItem {
  title: string;
  value: string;
  icon: string;
  color: string;
}

interface DashboardStatsGridProps {
  stats: StatItem[];
}

const iconMap = {
  Package,
  Eye,
  DollarSign,
  TrendingUp
};

const DashboardStatsGrid: React.FC<DashboardStatsGridProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const IconComponent = iconMap[stat.icon as keyof typeof iconMap];
        
        return (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={stat.color}>
                  {IconComponent && <IconComponent className="w-5 h-5" />}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardStatsGrid;
