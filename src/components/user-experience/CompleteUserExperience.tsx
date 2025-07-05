import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, Coins, Search, Upload, 
  TrendingUp, Shield, Activity 
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import EnhancedMobileExperience from '../mobile/EnhancedMobileExperience';
import { InteractiveAnalyticsChart, AdvancedFilterComponent } from '../ui/AdvancedUIComponents';

const CompleteUserExperience = () => {
  const [activeTab, setActiveTab] = useState('browse');

  // Phase 7: Complete user journey analytics
  const { data: userJourneyData } = useQuery({
    queryKey: ['phase7-user-journey'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analytics_events')
        .select('*')
        .in('event_type', ['user_login', 'coin_view', 'search_performed', 'upload_started'])
        .order('timestamp', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 10000
  });

  // Phase 7: Authentication flow data
  const { data: authStats } = useQuery({
    queryKey: ['phase7-auth-stats'],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, role, created_at, verified_dealer')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return profiles || [];
    }
  });

  // Phase 7: Marketplace browsing experience
  const { data: browsingData } = useQuery({
    queryKey: ['phase7-browsing-data'],
    queryFn: async () => {
      const [coins, categories] = await Promise.all([
        supabase.from('coins').select('*').limit(8),
        supabase.from('categories').select('*').eq('is_active', true)
      ]);
      
      return {
        coins: coins.data || [],
        categories: categories.data || []
      };
    }
  });

  // Phase 7: Upload workflow data
  const { data: uploadData } = useQuery({
    queryKey: ['phase7-upload-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dual_image_analysis')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data || [];
    }
  });

  const userJourneyChartData = userJourneyData?.reduce((acc, event) => {
    const eventType = event.event_type;
    acc[eventType] = (acc[eventType] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(userJourneyChartData || {}).map(([label, value]) => ({
    label,
    value: value as number
  }));

  return (
    <div className="space-y-6">
      {/* Phase 7: User Experience Header */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-6 w-6 text-blue-600" />
            Complete User Experience Flow
            <Badge className="bg-blue-100 text-blue-800">Phase 7 Integration</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {authStats?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {browsingData?.coins?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Available Coins</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {browsingData?.categories?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {uploadData?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">AI Analyses</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Phase 7: Complete User Journey Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="browse" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Browse
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="mobile" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Mobile
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Browse Experience */}
        <TabsContent value="browse" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Coin Browsing Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {browsingData?.coins?.slice(0, 8).map((coin) => (
                      <Card key={coin.id} className="p-3">
                        <div className="aspect-square bg-muted rounded-lg mb-2 flex items-center justify-center">
                          <Coins className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="text-sm font-medium truncate">{coin.name}</div>
                        <div className="text-xs text-muted-foreground">${coin.price}</div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <AdvancedFilterComponent 
                categories={browsingData?.categories}
                onFilterChange={(filters) => console.log('Filters:', filters)}
              />
            </div>
          </div>
        </TabsContent>

        {/* Upload Experience */}
        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Upload Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Button className="w-full h-20 flex-col">
                      <Upload className="h-8 w-8 mb-2" />
                      Upload Coin Images
                    </Button>
                    <div className="text-sm text-muted-foreground">
                      Upload front and back images for AI analysis
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Recent AI Analyses:</div>
                    {uploadData?.map((analysis) => (
                      <div key={analysis.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center">
                          <div className="text-sm">Analysis #{analysis.id.substring(0, 8)}</div>
                          <Badge variant="outline">
                            {Math.round((analysis.confidence_score || 0) * 100)}%
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(analysis.created_at).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Experience */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InteractiveAnalyticsChart 
              title="User Journey Analytics"
              data={chartData}
            />
            
            <Card>
              <CardHeader>
                <CardTitle>Real-time User Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {userJourneyData?.slice(0, 5).map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <div className="text-sm font-medium">{event.event_type}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(event.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <Badge variant="outline">Live</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Mobile Experience */}
        <TabsContent value="mobile">
          <EnhancedMobileExperience />
        </TabsContent>

        {/* Security Experience */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                Authentication & Security Flow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {authStats?.filter(u => u.role === 'buyer').length || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Buyers</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {authStats?.filter(u => u.role === 'dealer').length || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Dealers</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {authStats?.filter(u => u.verified_dealer).length || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Verified</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompleteUserExperience;