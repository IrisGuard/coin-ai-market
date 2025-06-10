
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ErrorStatsCardsProps {
  recentErrors: any[];
}

const ErrorStatsCards = ({ recentErrors }: ErrorStatsCardsProps) => {
  // Count errors by severity
  const criticalCount = recentErrors.filter(e => e.severity === 'critical').length;
  const highCount = recentErrors.filter(e => e.severity === 'high').length;
  const mediumCount = recentErrors.filter(e => e.severity === 'medium').length;
  const totalCount = recentErrors.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {criticalCount}
            </div>
            <div className="text-sm text-gray-600">Critical Errors</div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {highCount}
            </div>
            <div className="text-sm text-gray-600">High Priority</div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {mediumCount}
            </div>
            <div className="text-sm text-gray-600">Medium Priority</div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {totalCount}
            </div>
            <div className="text-sm text-gray-600">Total Recent</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorStatsCards;
