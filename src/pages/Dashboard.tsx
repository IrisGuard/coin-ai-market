
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardStatsGrid from '@/components/dashboard/DashboardStatsGrid';
import DashboardTabsContent from '@/components/dashboard/DashboardTabsContent';
import { DataSyncStatus } from '@/components/dashboard/DataSyncStatus';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDashboardData } from '@/hooks/useDashboardData';

const Dashboard = () => {
  const { user } = useAuth();
  const { stats, watchlistItems, recentTransactions, favorites } = useDashboardData();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <DashboardHeader />
        
        {/* Data Sync Status */}
        <DataSyncStatus />
        
        <DashboardStatsGrid stats={stats} />
        
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <DashboardTabsContent 
            watchlistItems={watchlistItems}
            recentTransactions={recentTransactions}
            favorites={favorites}
          />
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
