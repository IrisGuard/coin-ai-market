
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Clock, Eye, TrendingUp } from 'lucide-react';

const DashboardQuickActions: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button className="w-full justify-start" variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add New Coin to Portfolio
        </Button>
        <Button className="w-full justify-start" variant="outline">
          <Clock className="h-4 w-4 mr-2" />
          Create Auction Listing
        </Button>
        <Button className="w-full justify-start" variant="outline">
          <Eye className="h-4 w-4 mr-2" />
          Browse New Arrivals
        </Button>
        <Button className="w-full justify-start" variant="outline">
          <TrendingUp className="h-4 w-4 mr-2" />
          View Market Trends
        </Button>
      </CardContent>
    </Card>
  );
};

export default DashboardQuickActions;
