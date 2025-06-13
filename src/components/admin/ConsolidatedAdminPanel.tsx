import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Settings, Users, Coins, Zap } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Import the new performance optimized dashboard
import PerformanceOptimizedDashboard from './PerformanceOptimizedDashboard';

// Keep existing imports
import AdminStatsOverview from './AdminStatsOverview';
import AdminUsersSection from './AdminUsersSection';
import AdminCoinsSection from './AdminCoinsSection';
import AdminTabsList from './navigation/AdminTabsList';

const ConsolidatedAdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const handlePerformanceTest = async () => {
    try {
      toast({
        title: "Performance Test",
        description: "Running optimized queries...",
      });
      
      // Test will be handled by the dashboard component automatically
      console.log('🚀 Performance test initiated via dashboard monitoring');
    } catch (error) {
      console.error('❌ Performance test failed:', error);
      toast({
        title: "Performance Test Failed",
        description: "Check console for details",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Performance Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admin Control Panel</h1>
              <p className="text-muted-foreground">Performance Optimized Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handlePerformanceTest}
              className="flex items-center gap-1"
            >
              <Zap className="h-4 w-4" />
              Test Performance
            </Button>
          </div>
        </div>

        {/* Enhanced Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <AdminTabsList activeTab={activeTab} />
          
          <TabsContent value="dashboard" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-green-600" />
                  Performance Optimized Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PerformanceOptimizedDashboard />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <AdminUsersSection />
          </TabsContent>

          <TabsContent value="coins">
            <AdminCoinsSection />
          </TabsContent>

          <TabsContent value="stats">
            <Card>
              <CardHeader>
                <CardTitle>Legacy Statistics Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <AdminStatsOverview />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  System Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>System settings will be available here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ConsolidatedAdminPanel;
