
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { useEnhancedStoreData, useStoreActivityLogs, useStorePerformanceMetrics, useBulkStoreOperations } from '@/hooks/admin/useEnhancedStores';
import { Store, Activity, TrendingUp, Users, Package, DollarSign, Eye, CheckCircle, XCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const EnhancedStoreManager = () => {
  const { data: stores, isLoading } = useEnhancedStoreData();
  const { data: performanceMetrics } = useStorePerformanceMetrics();
  const { data: activityLogs } = useStoreActivityLogs();
  const bulkOperationMutation = useBulkStoreOperations();
  
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [selectedStore, setSelectedStore] = useState<any>(null);

  const handleSelectStore = (storeId: string) => {
    setSelectedStores(prev => 
      prev.includes(storeId) 
        ? prev.filter(id => id !== storeId)
        : [...prev, storeId]
    );
  };

  const handleSelectAll = () => {
    if (selectedStores.length === stores?.length) {
      setSelectedStores([]);
    } else {
      setSelectedStores(stores?.map(store => store.id) || []);
    }
  };

  const handleBulkOperation = async (operation: 'verify' | 'activate' | 'deactivate', value: boolean) => {
    if (selectedStores.length === 0) {
      toast({
        title: "No stores selected",
        description: "Please select stores to perform bulk operations",
        variant: "destructive"
      });
      return;
    }

    try {
      await bulkOperationMutation.mutateAsync({
        storeIds: selectedStores,
        operation,
        value
      });
      setSelectedStores([]);
    } catch (error) {
      console.error('Bulk operation failed:', error);
    }
  };

  const getStoreMetrics = (storeId: string) => {
    return performanceMetrics?.find(metric => metric.store_id === storeId);
  };

  const getRecentActivity = (storeId: string) => {
    return activityLogs?.filter(log => log.stores?.name && log.stores.name === stores?.find(s => s.id === storeId)?.name).slice(0, 5) || [];
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>Loading enhanced store data...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Bulk Operations Bar */}
      {selectedStores.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {selectedStores.length} store(s) selected
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleBulkOperation('verify', true)}
                  disabled={bulkOperationMutation.isPending}
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Verify All
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkOperation('activate', true)}
                  disabled={bulkOperationMutation.isPending}
                >
                  Activate All
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkOperation('deactivate', false)}
                  disabled={bulkOperationMutation.isPending}
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Deactivate All
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Store className="w-5 h-5" />
              Enhanced Store Management
            </CardTitle>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={selectedStores.length === stores?.length && stores?.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-gray-600">Select All</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stores?.map((store) => {
              const metrics = getStoreMetrics(store.id);
              const recentActivity = getRecentActivity(store.id);
              
              return (
                <Card key={store.id} className="relative">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Checkbox
                        checked={selectedStores.includes(store.id)}
                        onCheckedChange={() => handleSelectStore(store.id)}
                      />
                      
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={store.logo_url} />
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {store.name?.[0] || 'S'}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-4">
                        {/* Store Header */}
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-medium">{store.name}</h3>
                              <Badge variant={store.verified ? 'default' : 'secondary'}>
                                {store.verified ? 'Verified' : 'Unverified'}
                              </Badge>
                              <Badge variant={store.is_active ? 'default' : 'destructive'}>
                                {store.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                            <p className="text-gray-600">{store.description}</p>
                            <p className="text-sm text-gray-500">
                              Owner: {store.profiles?.full_name} ({store.profiles?.email})
                            </p>
                          </div>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedStore(store)}
                              >
                                <Activity className="w-4 h-4 mr-1" />
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>{store.name} - Detailed Analytics</DialogTitle>
                              </DialogHeader>
                              {selectedStore && (
                                <div className="space-y-6">
                                  {/* Performance Metrics */}
                                  {metrics && (
                                    <div>
                                      <h4 className="font-medium mb-3">Performance Metrics</h4>
                                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="p-4 bg-blue-50 rounded-lg">
                                          <div className="text-2xl font-bold text-blue-600">
                                            {metrics.total_listings}
                                          </div>
                                          <div className="text-sm text-blue-800">Total Listings</div>
                                        </div>
                                        <div className="p-4 bg-green-50 rounded-lg">
                                          <div className="text-2xl font-bold text-green-600">
                                            {metrics.sold_items}
                                          </div>
                                          <div className="text-sm text-green-800">Sold Items</div>
                                        </div>
                                        <div className="p-4 bg-purple-50 rounded-lg">
                                          <div className="text-2xl font-bold text-purple-600">
                                            ${metrics.total_revenue.toFixed(2)}
                                          </div>
                                          <div className="text-sm text-purple-800">Total Revenue</div>
                                        </div>
                                        <div className="p-4 bg-orange-50 rounded-lg">
                                          <div className="text-2xl font-bold text-orange-600">
                                            {metrics.conversion_rate.toFixed(1)}%
                                          </div>
                                          <div className="text-sm text-orange-800">Conversion Rate</div>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Recent Coins */}
                                  <div>
                                    <h4 className="font-medium mb-3">Recent Listings</h4>
                                    <div className="space-y-2 max-h-60 overflow-y-auto">
                                      {store.coins?.slice(0, 10).map((coin: any) => (
                                        <div key={coin.id} className="flex items-center gap-3 p-3 border rounded-lg">
                                          <img 
                                            src={coin.image || '/placeholder.svg'} 
                                            alt={coin.name}
                                            className="w-12 h-12 rounded object-cover"
                                          />
                                          <div className="flex-1">
                                            <p className="font-medium">{coin.name}</p>
                                            <p className="text-sm text-gray-600">${coin.price}</p>
                                          </div>
                                          <Badge variant={coin.sold ? 'secondary' : 'default'}>
                                            {coin.sold ? 'Sold' : 'Active'}
                                          </Badge>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Recent Activity */}
                                  <div>
                                    <h4 className="font-medium mb-3">Recent Activity</h4>
                                    <div className="space-y-2 max-h-60 overflow-y-auto">
                                      {recentActivity.length > 0 ? (
                                        recentActivity.map((log: any) => (
                                          <div key={log.id} className="p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center justify-between">
                                              <span className="font-medium">{log.activity_type}</span>
                                              <span className="text-sm text-gray-500">
                                                {new Date(log.created_at).toLocaleDateString()}
                                              </span>
                                            </div>
                                            {log.activity_data && Object.keys(log.activity_data).length > 0 && (
                                              <pre className="text-xs text-gray-600 mt-1">
                                                {JSON.stringify(log.activity_data, null, 2)}
                                              </pre>
                                            )}
                                          </div>
                                        ))
                                      ) : (
                                        <p className="text-gray-500 text-center py-4">No recent activity</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>

                        {/* Quick Stats */}
                        {metrics && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Package className="w-4 h-4 text-blue-600" />
                              <span>{metrics.total_listings} listings</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-green-600" />
                              <span>{metrics.sold_items} sold</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-purple-600" />
                              <span>${metrics.total_revenue.toFixed(0)} revenue</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Eye className="w-4 h-4 text-orange-600" />
                              <span>{metrics.total_views} views</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedStoreManager;
