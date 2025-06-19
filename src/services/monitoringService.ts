
import { supabase } from '@/integrations/supabase/client';

export interface SystemHealthMetric {
  id?: string;
  metric_name: string;
  metric_value: number;
  metric_type: 'cpu' | 'memory' | 'disk' | 'network' | 'database' | 'api_response_time';
  threshold_warning: number;
  threshold_critical: number;
  status: 'healthy' | 'warning' | 'critical';
  created_at?: string;
}

export interface PerformanceAlert {
  id?: string;
  alert_type: 'performance' | 'error' | 'security' | 'uptime';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  metric_value?: number;
  threshold_breached?: number;
  auto_resolve: boolean;
  resolved_at?: string;
  created_at?: string;
}

export interface UptimeRecord {
  id?: string;
  service_name: string;
  status: 'up' | 'down' | 'degraded';
  response_time_ms: number;
  error_message?: string;
  check_timestamp: string;
}

export interface ResourceUsageLog {
  id?: string;
  resource_type: 'cpu' | 'memory' | 'disk' | 'network' | 'database_connections';
  usage_percentage: number;
  absolute_value?: number;
  unit?: string;
  recorded_at: string;
}

class MonitoringService {
  // System Health Monitoring
  async recordSystemHealth(metric: Omit<SystemHealthMetric, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('system_health_metrics')
      .insert([metric])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getSystemHealthMetrics(minutes: number = 60) {
    const since = new Date(Date.now() - minutes * 60 * 1000).toISOString();
    
    const { data, error } = await supabase
      .from('system_health_metrics')
      .select('*')
      .gte('created_at', since)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Performance Alerts
  async createAlert(alert: Omit<PerformanceAlert, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('performance_alerts')
      .insert([alert])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getActiveAlerts() {
    const { data, error } = await supabase
      .from('performance_alerts')
      .select('*')
      .is('resolved_at', null)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async resolveAlert(alertId: string) {
    const { data, error } = await supabase
      .from('performance_alerts')
      .update({ resolved_at: new Date().toISOString() })
      .eq('id', alertId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Uptime Monitoring
  async recordUptimeCheck(record: Omit<UptimeRecord, 'id'>) {
    const { data, error } = await supabase
      .from('uptime_monitoring')
      .insert([record])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getUptimeStats(serviceName: string, hours: number = 24) {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
    
    const { data, error } = await supabase
      .from('uptime_monitoring')
      .select('*')
      .eq('service_name', serviceName)
      .gte('check_timestamp', since)
      .order('check_timestamp', { ascending: false });

    if (error) throw error;
    
    if (!data || data.length === 0) return { uptime: 100, avgResponseTime: 0, totalChecks: 0 };

    const totalChecks = data.length;
    const upChecks = data.filter(record => record.status === 'up').length;
    const uptime = (upChecks / totalChecks) * 100;
    const avgResponseTime = data.reduce((sum, record) => sum + record.response_time_ms, 0) / totalChecks;

    return { uptime, avgResponseTime, totalChecks };
  }

  // Resource Usage Logging
  async logResourceUsage(usage: Omit<ResourceUsageLog, 'id'>) {
    const { data, error } = await supabase
      .from('resource_usage_logs')
      .insert([usage])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getResourceUsage(resourceType: string, hours: number = 24) {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
    
    const { data, error } = await supabase
      .from('resource_usage_logs')
      .select('*')
      .eq('resource_type', resourceType)
      .gte('recorded_at', since)
      .order('recorded_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Real-time System Checks
  async performSystemHealthCheck() {
    const checks = [];

    try {
      // Database response time check
      const dbStart = Date.now();
      await supabase.from('profiles').select('id').limit(1);
      const dbResponseTime = Date.now() - dbStart;
      
      checks.push({
        metric_name: 'database_response_time',
        metric_value: dbResponseTime,
        metric_type: 'database' as const,
        threshold_warning: 1000,
        threshold_critical: 3000,
        status: dbResponseTime > 3000 ? 'critical' as const : 
                dbResponseTime > 1000 ? 'warning' as const : 'healthy' as const
      });

      // Check for recent errors
      const { data: recentErrors } = await supabase
        .from('error_logs')
        .select('id')
        .gte('created_at', new Date(Date.now() - 5 * 60 * 1000).toISOString());

      const errorCount = recentErrors?.length || 0;
      checks.push({
        metric_name: 'error_rate_5min',
        metric_value: errorCount,
        metric_type: 'api_response_time' as const,
        threshold_warning: 5,
        threshold_critical: 15,
        status: errorCount > 15 ? 'critical' as const :
                errorCount > 5 ? 'warning' as const : 'healthy' as const
      });

      // Record all checks
      for (const check of checks) {
        await this.recordSystemHealth(check);
      }

      return checks;
    } catch (error) {
      console.error('System health check failed:', error);
      return [];
    }
  }

  // Auto-escalation for critical alerts
  async checkAndEscalateAlerts() {
    const criticalAlerts = await supabase
      .from('performance_alerts')
      .select('*')
      .eq('severity', 'critical')
      .is('resolved_at', null)
      .lt('created_at', new Date(Date.now() - 10 * 60 * 1000).toISOString()); // 10 minutes old

    if (criticalAlerts.data && criticalAlerts.data.length > 0) {
      console.warn(`${criticalAlerts.data.length} unresolved critical alerts detected`);
      // In production, this would trigger notifications to administrators
    }
  }

  // Performance baseline establishment
  async establishPerformanceBaseline() {
    const baseline = {
      avg_db_response_time: 200,
      max_cpu_usage: 70,
      max_memory_usage: 80,
      max_error_rate_per_hour: 10,
      min_uptime_percentage: 99.5
    };

    // Store baseline in analytics_events for reference
    await supabase
      .from('analytics_events')
      .insert([{
        event_type: 'performance_baseline_established',
        page_url: '/admin/monitoring',
        metadata: baseline
      }]);

    return baseline;
  }
}

export const monitoringService = new MonitoringService();
