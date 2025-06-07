
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Clock, 
  Heart, 
  BarChart3,
  Eye,
  ShoppingCart
} from 'lucide-react';

interface DashboardTabsContentProps {
  watchlistItems: any[];
  recentTransactions: any[];
  favorites: any[];
}

const DashboardTabsContent = ({ 
  watchlistItems, 
  recentTransactions, 
  favorites 
}: DashboardTabsContentProps) => {
  return (
    <>
      <TabsContent value="overview" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Watchlist
              </CardTitle>
              <CardDescription>
                Coins you're tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              {watchlistItems.length > 0 ? (
                <div className="space-y-3">
                  {watchlistItems.slice(0, 5).map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div>
                          <p className="font-medium">Watchlist Item {index + 1}</p>
                          <p className="text-sm text-gray-600">Tracking price changes</p>
                        </div>
                      </div>
                      <Badge variant="outline">Active</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No items in watchlist</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Your latest transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentTransactions.length > 0 ? (
                <div className="space-y-3">
                  {recentTransactions.slice(0, 5).map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div>
                          <p className="font-medium">Transaction {index + 1}</p>
                          <p className="text-sm text-gray-600">Recent activity</p>
                        </div>
                      </div>
                      <Badge variant="secondary">Completed</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No recent transactions</p>
              )}
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="portfolio" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Overview</CardTitle>
            <CardDescription>
              Detailed view of your coin collection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Portfolio analytics coming soon</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="activity" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Activity Feed</CardTitle>
            <CardDescription>
              All your marketplace activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((transaction, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1">
                      <p className="font-medium">Activity {index + 1}</p>
                      <p className="text-sm text-gray-600">Transaction details</p>
                    </div>
                    <Badge variant="outline">
                      {new Date().toLocaleDateString()}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No activity yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="analytics" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Analytics Dashboard</CardTitle>
            <CardDescription>
              Performance metrics and insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Advanced analytics coming soon</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </>
  );
};

export default DashboardTabsContent;
