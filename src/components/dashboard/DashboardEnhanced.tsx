
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserStore } from '@/hooks/useStores';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Store, 
  Plus, 
  Package, 
  Gavel, 
  Settings, 
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import DashboardStatsGrid from './DashboardStatsGrid';
import { Link } from 'react-router-dom';

const SITE_BUILDER_PHASES = [
  { id: 1, name: 'Store Setup', completed: true, icon: Store },
  { id: 2, name: 'Product Listings', completed: false, icon: Package },
  { id: 3, name: 'Auction System', completed: false, icon: Gavel },
  { id: 4, name: 'Payment Setup', completed: false, icon: TrendingUp },
  { id: 5, name: 'Go Live', completed: false, icon: CheckCircle }
];

const DashboardEnhanced = () => {
  const { user } = useAuth();
  const { data: store } = useUserStore();
  const { stats, watchlistItems, recentTransactions, favorites } = useDashboardData();

  const completedPhases = SITE_BUILDER_PHASES.filter(phase => phase.completed).length;
  const progressPercentage = (completedPhases / SITE_BUILDER_PHASES.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.user_metadata?.full_name || user?.email}
            </h1>
            {store && (
              <p className="text-gray-600 mt-1">
                Managing: <span className="font-semibold text-orange-600">{store.name}</span>
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <Link to="/coin-upload">
              <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Listing
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <DashboardStatsGrid stats={stats} />

        {/* Enhanced Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="site-builder">Site Builder</TabsTrigger>
            <TabsTrigger value="listings">My Listings</TabsTrigger>
            <TabsTrigger value="create-listing">Create Listing</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link to="/coin-upload">
                    <Button variant="outline" className="w-full justify-start">
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Listing
                    </Button>
                  </Link>
                  <Link to="/auctions">
                    <Button variant="outline" className="w-full justify-start">
                      <Gavel className="w-4 h-4 mr-2" />
                      View Active Auctions
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  {recentTransactions.length > 0 ? (
                    <div className="space-y-3">
                      {recentTransactions.slice(0, 5).map((transaction: any) => (
                        <div key={transaction.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm">{transaction.coin_id?.name || 'Unknown Item'}</span>
                          <Badge variant="outline">${transaction.amount}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No recent activity</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="site-builder" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="w-5 h-5" />
                  Site Builder Progress
                </CardTitle>
                <div className="space-y-2">
                  <Progress value={progressPercentage} className="w-full" />
                  <p className="text-sm text-gray-600">
                    {completedPhases} of {SITE_BUILDER_PHASES.length} phases completed ({progressPercentage.toFixed(0)}%)
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {SITE_BUILDER_PHASES.map((phase) => {
                    const Icon = phase.icon;
                    return (
                      <div key={phase.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className={`p-2 rounded-full ${
                          phase.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{phase.name}</h3>
                        </div>
                        <div>
                          {phase.completed ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <Clock className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="listings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Listings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No listings yet</p>
                  <Link to="/coin-upload">
                    <Button>Create Your First Listing</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create-listing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Listing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link to="/coin-upload?type=direct">
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-6 text-center">
                        <Package className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                        <h3 className="font-semibold mb-2">Direct Sale</h3>
                        <p className="text-sm text-gray-600">Set a fixed price for immediate purchase</p>
                      </CardContent>
                    </Card>
                  </Link>
                  
                  <Link to="/coin-upload?type=auction">
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-6 text-center">
                        <Gavel className="w-8 h-8 text-red-500 mx-auto mb-3" />
                        <h3 className="font-semibold mb-2">Auction</h3>
                        <p className="text-sm text-gray-600">Let buyers compete with bids</p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Store Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Analytics will appear here once you have listings</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Store Settings</CardTitle>
              </CardHeader>
              <CardContent>
                {store ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Store Name</label>
                      <p className="text-gray-600">{store.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <p className="text-gray-600">{store.description || 'No description set'}</p>
                    </div>
                    <Button variant="outline">
                      <Settings className="w-4 h-4 mr-2" />
                      Edit Store Settings
                    </Button>
                  </div>
                ) : (
                  <p className="text-gray-500">No store information available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DashboardEnhanced;
