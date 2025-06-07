
import React from 'react';
import { usePageView } from '@/hooks/usePageView';
import { useDealerStores } from '@/hooks/useDealerStores';
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Store, Users, TrendingUp, Eye, Edit, Trash2 } from 'lucide-react';

const MarketplacePanelPage = () => {
  usePageView();
  
  const { data: dealers, isLoading: dealersLoading } = useDealerStores();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-electric-green to-electric-blue bg-clip-text text-transparent mb-2">
            User Marketplace Panel
          </h1>
          <p className="text-gray-600">
            Manage user stores, track performance, and oversee marketplace activity
          </p>
        </div>

        {/* Marketplace Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active User Stores</CardTitle>
              <Store className="h-4 w-4 text-electric-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dealers?.length || 0}</div>
              <p className="text-xs text-gray-600">Verified dealers worldwide</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
              <Eye className="h-4 w-4 text-electric-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12,456</div>
              <p className="text-xs text-gray-600">+18% this month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue Growth</CardTitle>
              <TrendingUp className="h-4 w-4 text-electric-orange" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+24%</div>
              <p className="text-xs text-gray-600">Compared to last quarter</p>
            </CardContent>
          </Card>
        </div>

        {/* User Stores Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              User Stores Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dealersLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg animate-pulse">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-16 h-8 bg-gray-200 rounded"></div>
                      <div className="w-16 h-8 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {dealers?.map((dealer) => (
                  <div key={dealer.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={dealer.avatar_url} />
                        <AvatarFallback className="bg-electric-blue/10 text-electric-blue">
                          {dealer.full_name?.[0] || dealer.username?.[0] || 'D'}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{dealer.full_name || dealer.username}</h3>
                          {dealer.verified_dealer && (
                            <Badge variant="secondary" className="bg-electric-green/10 text-electric-green">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {dealer.location} • Rating: {dealer.rating || 'N/A'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                )) || []}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MarketplacePanelPage;
