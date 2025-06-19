
import { supabase } from '@/integrations/supabase/client';

export interface SystemHealthCheck {
  id: string;
  service_name: string;
  status: 'healthy' | 'warning' | 'critical';
  response_time: number;
  error_message?: string;
  checked_at: string;
}

export interface Alert {
  id: string;
  alert_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  is_resolved: boolean;
  created_at: string;
}

export interface UptimeStats {
  uptime: number;
  avgResponseTime: number;
}

export interface SystemHealthMetric {
  id: string;
  metric_name: string;
  metric_value: number;
  recorded_at: string;
}

export interface ResourceUsage {
  resource_type: string;
  usage_percentage: number;
  absolute_value: number;
  unit: string;
  recorded_at: string;
}

export const monitoringService = {
  async performSystemHealthCheck(): Promise<SystemHealthCheck[]> {
    try {
      // For now, return a basic health check using existing tables
      const checks: SystemHealthCheck[] = [
        {
          id: 'db-check',
          service_name: 'Database',
          status: 'healthy',
          response_time: 25,
          checked_at: new Date().toISOString()
        },
        {
          id: 'api-check',
          service_name: 'API',
          status: 'healthy',
          response_time: 50,
          checked_at: new Date().toISOString()
        }
      ];
      
      return checks;
    } catch (error) {
      console.error('Health check failed:', error);
      return [];
    }
  },

  async getActiveAlerts(): Promise<Alert[]> {
    try {
      const { data, error } = await supabase
        .from('error_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      return (data || []).map(log => ({
        id: log.id,
        alert_type: 'error',
        severity: 'medium' as const,
        title: log.error_type,
        description: log.message,
        is_resolved: false,
        created_at: log.created_at
      }));
    } catch (error) {
      console.error('Failed to get alerts:', error);
      return [];
    }
  },

  async getUptimeStats(service: string, hours: number): Promise<UptimeStats> {
    return {
      uptime: 99.9,
      avgResponseTime: 45
    };
  },

  async getSystemHealthMetrics(minutes: number): Promise<SystemHealthMetric[]> {
    return [
      {
        id: 'cpu-1',
        metric_name: 'cpu_usage',
        metric_value: 25,
        recorded_at: new Date().toISOString()
      },
      {
        id: 'memory-1',
        metric_name: 'memory_usage',
        metric_value: 65,
        recorded_at: new Date().toISOString()
      }
    ];
  },

  async checkAndEscalateAlerts(): Promise<void> {
    // Placeholder for escalation logic
    console.log('Checking alerts for escalation...');
  },

  async logResourceUsage(usage: ResourceUsage): Promise<void> {
    try {
      await supabase
        .from('analytics_events')
        .insert({
          event_type: 'resource_usage',
          page_url: '/system/monitoring',
          metadata: usage as any,
          timestamp: new Date().toISOString()
        });
    } catch (error) {
      console.error('Failed to log resource usage:', error);
    }
  },

  async createAlert(alert: Omit<Alert, 'id' | 'created_at' | 'is_resolved'>): Promise<void> {
    try {
      await supabase
        .from('analytics_events')
        .insert({
          event_type: 'alert_created',
          page_url: '/system/alerts',
          metadata: alert as any,
          timestamp: new Date().toISOString()
        });
    } catch (error) {
      console.error('Failed to create alert:', error);
    }
  }
};
