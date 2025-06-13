
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Database, Globe, Activity, CheckCircle } from 'lucide-react';
import { useCleanErrorReferenceSources, useCleanSourcePerformanceMetrics, useCleanVpnProxies } from '@/hooks/admin/useCleanSecurityTables';

const CleanSecurityTablesSection = () => {
  const { data: errorSources = [], isLoading: errorSourcesLoading } = useCleanErrorReferenceSources();
  const { data: performanceMetrics = [], isLoading: performanceLoading } = useCleanSourcePerformanceMetrics();
  const { data: vpnProxies = [], isLoading: vpnLoading } = useCleanVpnProxies();

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Ενσωματωμένα Security & Infrastructure Tables
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardTitle>
          <CardDescription>
            Παρακολούθηση error reference sources, performance metrics, και VPN proxies με καθαρά ενσωματωμένα RLS policies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="error-sources" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="error-sources" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Error Sources ({errorSources.length})
              </TabsTrigger>
              <TabsTrigger value="performance-metrics" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Performance ({performanceMetrics.length})
              </TabsTrigger>
              <TabsTrigger value="vpn-proxies" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                VPN Proxies ({vpnProxies.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="error-sources" className="space-y-4">
              {errorSourcesLoading ? (
                <div className="text-center py-8 text-muted-foreground">Φόρτωση error reference sources...</div>
              ) : errorSources.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">Δεν βρέθηκαν error reference sources</div>
              ) : (
                errorSources.map((source: any) => (
                  <div key={source.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{source.source_name}</h4>
                      <p className="text-sm text-gray-600">{source.source_url}</p>
                      <p className="text-xs text-gray-500">
                        Type: {source.source_type} • Reliability: {(source.reliability_score * 100).toFixed(1)}%
                      </p>
                      {source.last_scraped && (
                        <p className="text-xs text-gray-500">
                          Last scraped: {new Date(source.last_scraped).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(source.is_active)}>
                        {source.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="performance-metrics" className="space-y-4">
              {performanceLoading ? (
                <div className="text-center py-8 text-muted-foreground">Φόρτωση performance metrics...</div>
              ) : performanceMetrics.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">Δεν βρέθηκαν performance metrics</div>
              ) : (
                performanceMetrics.slice(0, 20).map((metric: any) => (
                  <div key={metric.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{metric.metric_name || 'Performance Metric'}</h4>
                      <p className="text-sm text-gray-600">
                        Source ID: {metric.source_id?.substring(0, 8)}...
                      </p>
                      <p className="text-xs text-gray-500">
                        Response Time: {metric.response_time_ms}ms • Success Rate: {metric.success_rate_percentage}%
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">
                        {new Date(metric.recorded_at).toLocaleDateString()}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="vpn-proxies" className="space-y-4">
              {vpnLoading ? (
                <div className="text-center py-8 text-muted-foreground">Φόρτωση VPN proxies...</div>
              ) : vpnProxies.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">Δεν βρέθηκαν VPN proxies</div>
              ) : (
                vpnProxies.map((proxy: any) => (
                  <div key={proxy.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{proxy.proxy_name || 'VPN Proxy'}</h4>
                      <p className="text-sm text-gray-600">
                        {proxy.proxy_host}:{proxy.proxy_port}
                      </p>
                      <p className="text-xs text-gray-500">
                        Type: {proxy.proxy_type} • Country: {proxy.country_code}
                      </p>
                      {proxy.last_health_check && (
                        <p className="text-xs text-gray-500">
                          Last check: {new Date(proxy.last_health_check).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(proxy.is_active)}>
                        {proxy.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      {proxy.response_time_ms && (
                        <Badge variant="outline">
                          {proxy.response_time_ms}ms
                        </Badge>
                      )}
                    </div>
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CleanSecurityTablesSection;
