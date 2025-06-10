
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PerformanceDetailsTableProps {
  performanceMetrics: any[];
}

const PerformanceDetailsTable = ({ performanceMetrics }: PerformanceDetailsTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Store Performance Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Store</th>
                <th className="text-right p-2">Listings</th>
                <th className="text-right p-2">Sold</th>
                <th className="text-right p-2">Revenue</th>
                <th className="text-right p-2">Conv. Rate</th>
              </tr>
            </thead>
            <tbody>
              {performanceMetrics?.map((metric) => (
                <tr key={metric.store_id} className="border-b hover:bg-gray-50">
                  <td className="p-2 font-medium">{metric.store_name}</td>
                  <td className="p-2 text-right">{metric.total_listings}</td>
                  <td className="p-2 text-right">{metric.sold_items}</td>
                  <td className="p-2 text-right">${metric.total_revenue.toFixed(2)}</td>
                  <td className="p-2 text-right">{metric.conversion_rate.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceDetailsTable;
