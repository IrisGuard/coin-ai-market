
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Globe, Search, Eye, Activity, AlertCircle, CheckCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface MonitoredSite {
  id: string;
  url: string;
  name: string;
  status: 'online' | 'offline' | 'checking';
  lastChecked: string;
  responseTime: number;
  errorCount: number;
}

const SiteManagementSection = () => {
  const [newSiteUrl, setNewSiteUrl] = useState('');
  const queryClient = useQueryClient();

  // Real-time site monitoring data
  const { data: monitoredSites, isLoading } = useQuery({
    queryKey: ['monitored-sites'],
    queryFn: async (): Promise<MonitoredSite[]> => {
      // Get AI commands with site URLs for monitoring
      const { data: commands } = await supabase
        .from('ai_commands')
        .select('id, name, site_url, updated_at')
        .not('site_url', 'is', null)
        .eq('is_active', true);

      if (!commands) return [];

      // Get recent execution data for each site
      const sitesWithStatus = await Promise.all(
        commands.map(async (command) => {
          const { data: executions } = await supabase
            .from('ai_command_executions')
            .select('execution_status, execution_time_ms, created_at')
            .eq('command_id', command.id)
            .order('created_at', { ascending: false })
            .limit(5);

          const recentExecution = executions?.[0];
          const errorCount = executions?.filter(e => e.execution_status === 'failed').length || 0;
          const avgResponseTime = executions?.length > 0
            ? executions.reduce((sum, e) => sum + (e.execution_time_ms || 0), 0) / executions.length
            : 0;

          return {
            id: command.id,
            url: command.site_url,
            name: command.name,
            status: recentExecution?.execution_status === 'completed' ? 'online' : 
                   recentExecution?.execution_status === 'failed' ? 'offline' : 'checking',
            lastChecked: recentExecution?.created_at || command.updated_at,
            responseTime: Math.round(avgResponseTime),
            errorCount
          } as MonitoredSite;
        })
      );

      return sitesWithStatus;
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Add new site for monitoring
  const addSiteMutation = useMutation({
    mutationFn: async (url: string) => {
      const { data, error } = await supabase
        .from('ai_commands')
        .insert({
          name: `Site Monitor: ${new URL(url).hostname}`,
          description: `Automated monitoring for ${url}`,
          site_url: url,
          command_type: 'site_monitoring',
          category: 'web_scraping',
          code: 'Monitor site availability and performance',
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Site added for monitoring');
      setNewSiteUrl('');
      queryClient.invalidateQueries({ queryKey: ['monitored-sites'] });
    },
    onError: (error: any) => {
      toast.error(`Failed to add site: ${error.message}`);
    }
  });

  // Check site status manually
  const checkSiteMutation = useMutation({
    mutationFn: async (siteId: string) => {
      const { data, error } = await supabase.rpc('execute_ai_command', {
        p_command_id: siteId,
        p_input_data: { action: 'health_check' }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Site check initiated');
      queryClient.invalidateQueries({ queryKey: ['monitored-sites'] });
    },
    onError: (error: any) => {
      toast.error(`Site check failed: ${error.message}`);
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800';
      case 'offline': return 'bg-red-100 text-red-800';
      case 'checking': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircle className="h-4 w-4" />;
      case 'offline': return <AlertCircle className="h-4 w-4" />;
      case 'checking': return <Activity className="h-4 w-4 animate-pulse" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Live Site Management & Monitoring
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add New Site */}
        <div className="flex gap-2">
          <Input
            placeholder="Enter website URL to monitor..."
            value={newSiteUrl}
            onChange={(e) => setNewSiteUrl(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={() => newSiteUrl && addSiteMutation.mutate(newSiteUrl)}
            disabled={!newSiteUrl || addSiteMutation.isPending}
          >
            <Search className="h-4 w-4 mr-2" />
            {addSiteMutation.isPending ? 'Adding...' : 'Add Site'}
          </Button>
        </div>

        {/* Monitored Sites List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-600 mt-2">Loading monitored sites...</p>
            </div>
          ) : monitoredSites?.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Globe className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No sites being monitored yet</p>
              <p className="text-sm">Add a website URL above to start monitoring</p>
            </div>
          ) : (
            monitoredSites?.map((site) => (
              <div key={site.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(site.status)}
                      <span className="font-medium">{site.name}</span>
                    </div>
                    <Badge className={getStatusColor(site.status)}>
                      {site.status}
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => checkSiteMutation.mutate(site.id)}
                    disabled={checkSiteMutation.isPending}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Check Now
                  </Button>
                </div>
                
                <div className="text-sm text-gray-600 space-y-1">
                  <div>URL: {site.url}</div>
                  <div className="flex items-center gap-4">
                    <span>Response: {site.responseTime}ms</span>
                    <span>Last checked: {new Date(site.lastChecked).toLocaleTimeString()}</span>
                    {site.errorCount > 0 && (
                      <span className="text-red-600">
                        {site.errorCount} recent errors
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Stats */}
        {monitoredSites && monitoredSites.length > 0 && (
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {monitoredSites.filter(s => s.status === 'online').length}
              </div>
              <div className="text-xs text-gray-600">Online</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-600">
                {monitoredSites.filter(s => s.status === 'offline').length}
              </div>
              <div className="text-xs text-gray-600">Offline</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                {Math.round(monitoredSites.reduce((sum, s) => sum + s.responseTime, 0) / monitoredSites.length)}ms
              </div>
              <div className="text-xs text-gray-600">Avg Response</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SiteManagementSection;
