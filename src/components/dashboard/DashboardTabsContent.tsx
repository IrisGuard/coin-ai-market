
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';

interface DashboardTabsContentProps {
  watchlistItems: any[];
  recentTransactions: any[];
  favorites: any[];
}

const DashboardTabsContent: React.FC<DashboardTabsContentProps> = ({
  watchlistItems,
  recentTransactions,
  favorites
}) => {
  return (
    <>
      <TabsContent value="overview">
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold">Overview Dashboard</h3>
          <p className="text-gray-600">Your coin collection overview will appear here.</p>
        </div>
      </TabsContent>
      <TabsContent value="portfolio">
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold">Portfolio Management</h3>
          <p className="text-gray-600">Manage your coin portfolio here.</p>
        </div>
      </TabsContent>
      <TabsContent value="activity">
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          <p className="text-gray-600">Your recent activities will appear here.</p>
        </div>
      </TabsContent>
      <TabsContent value="analytics">
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold">Analytics Dashboard</h3>
          <p className="text-gray-600">Detailed analytics and insights will appear here.</p>
        </div>
      </TabsContent>
    </>
  );
};

export default DashboardTabsContent;
