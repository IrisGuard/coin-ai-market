import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Database, Globe, TrendingUp, Users, MapPin, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SourceStats {
  coin_sources: number;
  banknote_sources: number;
  bullion_sources: number;
  total_sources: number;
  by_country: Record<string, number>;
  by_type: Record<string, number>;
  active_sources: number;
  priority_1_sources: number;
}

const GlobalSourcesMonitor: React.FC = () => {
  const [sourcesStats, setSourcesStats] = useState<SourceStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSourcesStats();
    // Refresh every 30 seconds
    const interval = setInterval(fetchSourcesStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchSourcesStats = async () => {
    try {
      // Get all source types in parallel
      const [coinSources, banknoteSources, bullionSources] = await Promise.all([
        supabase.from('global_coin_sources').select('*').eq('is_active', true),
        supabase.from('global_banknote_sources').select('*').eq('is_active', true),
        supabase.from('global_bullion_sources').select('*').eq('is_active', true)
      ]);

      const allSources = [
        ...(coinSources.data || []),
        ...(banknoteSources.data || []),
        ...(bullionSources.data || [])
      ];

      const byCountry = allSources.reduce((acc, source) => {
        acc[source.country] = (acc[source.country] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const byType = allSources.reduce((acc, source) => {
        acc[source.source_type] = (acc[source.source_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const stats: SourceStats = {
        coin_sources: coinSources.data?.length || 0,
        banknote_sources: banknoteSources.data?.length || 0,
        bullion_sources: bullionSources.data?.length || 0,
        total_sources: allSources.length,
        by_country: byCountry,
        by_type: byType,
        active_sources: allSources.filter(s => s.is_active).length,
        priority_1_sources: allSources.filter(s => s.priority === 1).length
      };

      setSourcesStats(stats);
    } catch (error) {
      console.error('Failed to fetch sources stats:', error);
      toast.error('Failed to load global sources data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Global Sources Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!sourcesStats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Global Sources Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  const topCountries = Object.entries(sourcesStats.by_country)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const topSourceTypes = Object.entries(sourcesStats.by_type)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Overall Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Global Sources Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <div className="text-2xl font-bold text-primary">{sourcesStats.total_sources}</div>
              <div className="text-sm text-muted-foreground">Total Sources</div>
            </div>
            <div className="text-center p-4 bg-green-500/10 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{sourcesStats.active_sources}</div>
              <div className="text-sm text-muted-foreground">Active</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Coins</span>
              <Badge variant="secondary">{sourcesStats.coin_sources}</Badge>
            </div>
            <Progress value={(sourcesStats.coin_sources / sourcesStats.total_sources) * 100} className="h-2" />
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Banknotes</span>
              <Badge variant="secondary">{sourcesStats.banknote_sources}</Badge>
            </div>
            <Progress value={(sourcesStats.banknote_sources / sourcesStats.total_sources) * 100} className="h-2" />
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Bullion</span>
              <Badge variant="secondary">{sourcesStats.bullion_sources}</Badge>
            </div>
            <Progress value={(sourcesStats.bullion_sources / sourcesStats.total_sources) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Geographic Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Geographic Coverage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium">Countries Covered</span>
              <Badge variant="outline">{Object.keys(sourcesStats.by_country).length}</Badge>
            </div>
            
            {topCountries.map(([country, count]) => (
              <div key={country} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm">{country}</span>
                  <span className="text-xs text-muted-foreground">{count} sources</span>
                </div>
                <Progress value={(count / sourcesStats.total_sources) * 100} className="h-1" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Source Types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Source Types
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topSourceTypes.map(([type, count]) => (
              <div key={type} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                <span className="text-sm capitalize">{type.replace('_', ' ')}</span>
                <Badge variant="secondary">{count}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Priority Sources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Quality Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-amber-500/10 rounded-lg">
              <div className="text-2xl font-bold text-amber-600">{sourcesStats.priority_1_sources}</div>
              <div className="text-sm text-muted-foreground">Priority 1</div>
            </div>
            <div className="text-center p-4 bg-blue-500/10 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round((sourcesStats.active_sources / sourcesStats.total_sources) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
          </div>
          
          <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
            <h4 className="text-sm font-semibold text-green-800 dark:text-green-200 mb-2">
              🎯 Phase 2A Status: ACTIVE
            </h4>
            <p className="text-xs text-green-700 dark:text-green-300">
              Global AI Brain integrated with {sourcesStats.total_sources} sources across {Object.keys(sourcesStats.by_country).length} countries.
              Ready for real-time dealer panel analysis.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GlobalSourcesMonitor;