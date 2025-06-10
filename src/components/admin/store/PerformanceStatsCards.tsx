
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface PerformanceStatsCardsProps {
  stores: any[];
  performanceMetrics: any[];
}

const PerformanceStatsCards = ({ stores, performanceMetrics }: PerformanceStatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {stores?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Total Stores</div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {stores?.filter(s => s.verified).length || 0}
            </div>
            <div className="text-sm text-gray-600">Verified Stores</div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {performanceMetrics?.reduce((sum, m) => sum + m.total_listings, 0) || 0}
            </div>
            <div className="text-sm text-gray-600">Total Listings</div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              ${performanceMetrics?.reduce((sum, m) => sum + m.total_revenue, 0).toFixed(0) || 0}
            </div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceStatsCards;
