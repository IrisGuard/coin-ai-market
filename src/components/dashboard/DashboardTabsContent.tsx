
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Star, Settings } from 'lucide-react';

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
      <TabsContent value="watchlist" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Watchlist</CardTitle>
            <CardDescription>Coins you're tracking and bidding on</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {watchlistItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">Current bid: {item.currentBid}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="mb-2">
                      <Clock className="w-3 h-3 mr-1" />
                      {item.timeLeft}
                    </Badge>
                    <br />
                    <Button size="sm" variant="outline">Place Bid</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="transactions" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your buying and selling history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      transaction.type === 'sale' ? 'bg-green-500' : 'bg-blue-500'
                    }`} />
                    <div>
                      <h3 className="font-semibold text-gray-900">{transaction.coin}</h3>
                      <p className="text-sm text-gray-600">{transaction.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{transaction.amount}</p>
                    <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="favorites" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Favorite Categories</CardTitle>
            <CardDescription>Coin types you collect most</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {favorites.map((favorite) => (
                <div key={favorite.id} className="text-center p-6 border rounded-lg hover:shadow-md transition-shadow">
                  <img src={favorite.image} alt={favorite.name} className="w-20 h-20 object-cover rounded-full mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">{favorite.name}</h3>
                  <Badge variant="secondary">
                    <Star className="w-3 h-3 mr-1" />
                    {favorite.count} coins
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="settings" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your preferences and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center py-8">
                <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Settings panel coming soon.</p>
                <p className="text-sm text-gray-400">Configure notifications, privacy, and account preferences.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </>
  );
};

export default DashboardTabsContent;
