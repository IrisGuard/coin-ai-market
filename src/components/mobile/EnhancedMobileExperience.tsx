import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Smartphone, Search, Upload, TrendingUp, 
  Activity, Users, Coins, Zap 
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileOptimizedLayout from './MobileOptimizedLayout';

const EnhancedMobileExperience = () => {
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState('');

  // Phase 7: Real-time mobile analytics
  const { data: mobileStats } = useQuery({
    queryKey: ['phase7-mobile-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analytics_events')
        .select('*')
        .ilike('event_type', '%mobile%')
        .order('timestamp', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 5000
  });

  // Phase 7: Enhanced categories integration
  const { data: categories } = useQuery({
    queryKey: ['phase7-categories-mobile'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Phase 7: AI recognition performance
  const { data: aiPerformance } = useQuery({
    queryKey: ['phase7-ai-performance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_recognition_cache')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data || [];
    }
  });

  // Phase 7: Real-time system health
  const { data: systemHealth } = useQuery({
    queryKey: ['phase7-system-health'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_metrics')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 10000
  });

  return (
    <MobileOptimizedLayout>
      <div className="space-y-6 p-4">
        {/* Phase 7: Mobile Experience Header */}
        <Card className="bg-gradient-to-r from-primary/10 to-blue-500/10 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-6 w-6 text-primary" />
              Enhanced Mobile Experience
              <Badge className="bg-green-100 text-green-800">Phase 7 Active</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {categories?.length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Active Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {mobileStats?.length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Mobile Events</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {aiPerformance?.length || 0}
                </div>
                <div className="text-sm text-muted-foreground">AI Recognitions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {systemHealth?.length || 0}
                </div>
                <div className="text-sm text-muted-foreground">System Metrics</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Phase 7: Enhanced Mobile Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-blue-600" />
              AI-Powered Mobile Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search coins with AI assistance..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                {categories?.slice(0, 6).map((category) => (
                  <Badge key={category.id} variant="outline" className="cursor-pointer hover:bg-primary/10">
                    {category.name}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Phase 7: Mobile AI Upload Integration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-green-600" />
              Advanced Mobile Upload
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button className="h-20 flex-col">
                  <Upload className="h-6 w-6 mb-2" />
                  Quick Upload
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Zap className="h-6 w-6 mb-2" />
                  AI Analysis
                </Button>
              </div>
              
              {aiPerformance?.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-medium">Recent AI Recognitions:</div>
                  {aiPerformance.slice(0, 3).map((recognition) => (
                    <div key={recognition.id} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                      <div className="text-sm">
                        Recognition #{recognition.id.substring(0, 8)}
                      </div>
                      <Badge variant="outline">
                        {Math.round((recognition.confidence_score || 0) * 100)}% confidence
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Phase 7: Real-time Mobile Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              Live Mobile Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mobileStats?.length > 0 ? (
                <div className="space-y-2">
                  {mobileStats.slice(0, 5).map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium text-sm">{event.event_type}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(event.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <Badge variant="outline">Live</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <div>No mobile analytics events yet</div>
                  <div className="text-sm">Events will appear here in real-time</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Phase 7: System Health Mobile Dashboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-red-600" />
              Mobile System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {systemHealth?.map((metric) => (
                <div key={metric.id} className="p-3 border rounded-lg">
                  <div className="font-semibold text-sm">{metric.metric_name}</div>
                  <div className="text-2xl font-bold text-primary">
                    {metric.metric_value}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {metric.metric_type}
                  </div>
                </div>
              )) || (
                <div className="col-span-full text-center py-4 text-muted-foreground">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <div className="text-sm">System metrics loading...</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MobileOptimizedLayout>
  );
};

export default EnhancedMobileExperience;