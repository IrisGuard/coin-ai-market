
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface DashboardHeaderProps {
  userName?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userName }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Enhanced Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {userName || 'Collector'}!</p>
      </div>
      <Button className="bg-brand-primary hover:bg-brand-primary/90">
        <Plus className="h-4 w-4 mr-2" />
        Quick Action
      </Button>
    </div>
  );
};

export default DashboardHeader;
