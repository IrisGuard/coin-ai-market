
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DatabaseStats {
  tables: Array<{
    name: string;
    rowCount: number;
    size: string;
    lastModified: string;
  }>;
  totalRecords: number;
  activeConnections: number;
  queryPerformance: {
    avgQueryTime: number;
    slowQueries: number;
  };
  totalTables: number;
  rlsPolicies: number;
  systemHealth: {
    status: string;
    uptime: number;
    memoryUsage: number;
  };
  aiStats: {
    totalCommands: number;
    activeModels: number;
    dailyExecutions: number;
    successRate: number;
    activeCommands: number;
    totalPredictions: number;
    totalKnowledgeEntries: number;
  };
  categories: Array<{
    name: string;
    count: number;
    status: string;
    id: string;
    color: string;
    icon: string;
    tables: number;
    records: number;
    description: string;
  }>;
}

export const useDatabaseStats = () => {
  return useQuery({
    queryKey: ['database-stats'],
    queryFn: async (): Promise<DatabaseStats> => {
      // Get counts from actual tables
      const [
        { count: coinsCount },
        { count: profilesCount },
        { count: storesCount },
        { count: analyticsCount },
        { count: aiCommandsCount },
        { count: categoriesCount }
      ] = await Promise.all([
        supabase.from('coins').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('stores').select('*', { count: 'exact', head: true }),
        supabase.from('analytics_events').select('*', { count: 'exact', head: true }),
        supabase.from('ai_commands').select('*', { count: 'exact', head: true }),
        supabase.from('categories').select('*', { count: 'exact', head: true })
      ]);

      const tables = [
        {
          name: 'coins',
          rowCount: coinsCount || 0,
          size: '2.3 MB',
          lastModified: new Date().toISOString()
        },
        {
          name: 'profiles',
          rowCount: profilesCount || 0,
          size: '1.1 MB',
          lastModified: new Date().toISOString()
        },
        {
          name: 'stores',
          rowCount: storesCount || 0,
          size: '0.8 MB',
          lastModified: new Date().toISOString()
        },
        {
          name: 'analytics_events',
          rowCount: analyticsCount || 0,
          size: '5.2 MB',
          lastModified: new Date().toISOString()
        },
        {
          name: 'ai_commands',
          rowCount: aiCommandsCount || 0,
          size: '0.4 MB',
          lastModified: new Date().toISOString()
        },
        {
          name: 'categories',
          rowCount: categoriesCount || 0,
          size: '0.1 MB',
          lastModified: new Date().toISOString()
        }
      ];

      const totalRecords = tables.reduce((sum, table) => sum + table.rowCount, 0);

      return {
        tables,
        totalRecords,
        activeConnections: 12, // Mock data
        queryPerformance: {
          avgQueryTime: 45, // milliseconds
          slowQueries: 2
        },
        totalTables: tables.length,
        rlsPolicies: 25,
        systemHealth: {
          status: 'healthy',
          uptime: 99.9,
          memoryUsage: 67.5
        },
        aiStats: {
          totalCommands: aiCommandsCount || 0,
          activeModels: 8,
          dailyExecutions: 245,
          successRate: 94.2,
          activeCommands: 15,
          totalPredictions: 1250,
          totalKnowledgeEntries: 850
        },
        categories: [
          { name: 'Error Coins', count: 45, status: 'active', id: '1', color: '#ff6b6b', icon: 'AlertTriangle', tables: 3, records: 45, description: 'Error coin detection and analysis' },
          { name: 'Greek Coins', count: 123, status: 'active', id: '2', color: '#51cf66', icon: 'Globe', tables: 2, records: 123, description: 'Greek numismatic collection' },
          { name: 'Modern Coins', count: 89, status: 'active', id: '3', color: '#339af0', icon: 'Coins', tables: 1, records: 89, description: 'Modern coin catalog' }
        ]
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
