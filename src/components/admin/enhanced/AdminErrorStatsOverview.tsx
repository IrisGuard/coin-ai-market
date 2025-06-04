
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminErrorStatsOverview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Error Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">156</div>
          <p className="text-xs text-muted-foreground">+12 this month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Market Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">489</div>
          <p className="text-xs text-muted-foreground">+23 this week</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">AI Confidence</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">87%</div>
          <p className="text-xs text-muted-foreground">+5% improvement</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Source Integration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">4/6</div>
          <p className="text-xs text-muted-foreground">Sources connected</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminErrorStatsOverview;
