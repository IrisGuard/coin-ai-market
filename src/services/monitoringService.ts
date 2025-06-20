
import { supabase } from '@/integrations/supabase/client';

interface MonitoringMetric {
  id: string;
  metric_name: string;
  metric_value: number;
  timestamp: string;
}

export class MonitoringService {
  static async recordMetric(name: string, value: number, tags?: Record<string, any>) {
    try {
      await supabase.rpc('record_system_metric', {
        p_metric_name: name,
        p_metric_value: value,
        p_tags: tags || {}
      });
    } catch (error) {
      console.error('Error recording metric:', error);
    }
  }

  static async getMetrics(metricName: string, hours = 24): Promise<MonitoringMetric[]> {
    try {
      const { data, error } = await supabase
        .from('system_metrics')
        .select('id, metric_name, metric_value, recorded_at')
        .eq('metric_name', metricName)
        .gte('created_at', new Date(Date.now() - hours * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform to match interface
      return (data || []).map(item => ({
        id: item.id,
        metric_name: item.metric_name,
        metric_value: item.metric_value,
        timestamp: item.recorded_at
      }));
    } catch (error) {
      console.error('Error fetching metrics:', error);
      return [];
    }
  }

  static async getSystemHealth() {
    try {
      const metrics = await Promise.all([
        this.getMetrics('cpu_usage', 1),
        this.getMetrics('memory_usage', 1),
        this.getMetrics('response_time', 1)
      ]);

      return {
        cpu: metrics[0]?.[0]?.metric_value || 0,
        memory: metrics[1]?.[0]?.metric_value || 0,
        responseTime: metrics[2]?.[0]?.metric_value || 0,
        status: 'healthy'
      };
    } catch (error) {
      console.error('Error getting system health:', error);
      return {
        cpu: 0,
        memory: 0,
        responseTime: 0,
        status: 'error'
      };
    }
  }
}
