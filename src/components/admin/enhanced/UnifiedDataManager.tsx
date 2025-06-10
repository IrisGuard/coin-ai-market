
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { 
  Database, Search, Trash2, RefreshCw, Download, 
  Upload, CheckCircle, AlertTriangle, Info
} from 'lucide-react';

const UnifiedDataManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTable, setSelectedTable] = useState<string>('');
  const queryClient = useQueryClient();

  // Get all tables with data counts
  const { data: tableStats, isLoading } = useQuery({
    queryKey: ['table-stats'],
    queryFn: async () => {
      const tables = [
        'profiles', 'coins', 'transactions', 'stores', 'categories',
        'bids', 'favorites', 'notifications', 'error_logs', 'analytics_events',
        'api_keys', 'admin_activity_logs', 'user_settings', 'marketplace_stats'
      ];
      
      const stats = await Promise.all(
        tables.map(async (table) => {
          try {
            const { count, error } = await supabase
              .from(table)
              .select('*', { count: 'exact', head: true });
            
            return {
              table,
              count: count || 0,
              status: error ? 'error' : 'healthy',
              error: error?.message
            };
          } catch (err) {
            return {
              table,
              count: 0,
              status: 'error',
              error: err instanceof Error ? err.message : 'Unknown error'
            };
          }
        })
      );
      
      return stats;
    }
  });

  // Clean up old data mutation
  const cleanupData = useMutation({
    mutationFn: async (table: string) => {
      // Only clean up analytics and logs older than 30 days
      if (['analytics_events', 'error_logs', 'admin_activity_logs'].includes(table)) {
        const { error } = await supabase
          .from(table)
          .delete()
          .lt('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());
        
        if (error) throw error;
        return `Cleaned up old ${table} data`;
      }
      throw new Error('Table not eligible for cleanup');
    },
    onSuccess: (message) => {
      toast({
        title: "Success",
        description: message,
      });
      queryClient.invalidateQueries({ queryKey: ['table-stats'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Refresh table stats
  const refreshStats = () => {
    queryClient.invalidateQueries({ queryKey: ['table-stats'] });
    toast({
      title: "Refreshed",
      description: "Table statistics updated",
    });
  };

  const filteredTables = tableStats?.filter(stat =>
    stat.table.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return CheckCircle;
      case 'error': return AlertTriangle;
      default: return Info;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Unified Data Manager
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshStats}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search tables..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Table Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTables.map((stat) => {
            const StatusIcon = getStatusIcon(stat.status);
            const canCleanup = ['analytics_events', 'error_logs', 'admin_activity_logs'].includes(stat.table);
            
            return (
              <div
                key={stat.table}
                className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedTable(stat.table)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{stat.table}</h3>
                  <StatusIcon className={`w-4 h-4 ${getStatusColor(stat.status)}`} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Records:</span>
                    <Badge variant="outline">{stat.count.toLocaleString()}</Badge>
                  </div>
                  
                  {stat.error && (
                    <p className="text-xs text-red-600">{stat.error}</p>
                  )}
                  
                  {canCleanup && stat.count > 1000 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        cleanupData.mutate(stat.table);
                      }}
                      disabled={cleanupData.isPending}
                      className="w-full"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Cleanup Old Data
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {tableStats?.length || 0}
            </p>
            <p className="text-sm text-gray-600">Total Tables</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {tableStats?.filter(t => t.status === 'healthy').length || 0}
            </p>
            <p className="text-sm text-gray-600">Healthy</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">
              {tableStats?.filter(t => t.status === 'error').length || 0}
            </p>
            <p className="text-sm text-gray-600">Errors</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {tableStats?.reduce((sum, t) => sum + t.count, 0).toLocaleString() || 0}
            </p>
            <p className="text-sm text-gray-600">Total Records</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UnifiedDataManager;
