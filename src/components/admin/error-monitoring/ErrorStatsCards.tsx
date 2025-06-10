
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ErrorStatsCardsProps {
  recentErrors: any[];
}

const ErrorStatsCards = ({ recentErrors }: ErrorStatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {recentErrors.filter(e => e.severity === 'critical').length}
            </div>
            <div className="text-sm text-gray-600">Critical Errors</div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {recentErrors.filter(e => e.severity === 'high').length}
            </div>
            <div className="text-sm text-gray-600">High Priority</div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {recentErrors.filter(e => e.severity === 'medium').length}
            </div>
            <div className="text-sm text-gray-600">Medium Priority</div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {recentErrors.length}
            </div>
            <div className="text-sm text-gray-600">Total Recent</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorStatsCards;
