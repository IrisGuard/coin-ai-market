
import { supabase } from '@/integrations/supabase/client';

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: Date;
  tags?: Record<string, any>;
}

export const recordPerformanceMetric = async (metric: PerformanceMetric) => {
  try {
    await supabase.rpc('record_system_metric', {
      p_metric_name: metric.name,
      p_metric_value: metric.value,
      p_tags: metric.tags || {}
    });
  } catch (error) {
    console.error('Error recording performance metric:', error);
  }
};

export const measureExecutionTime = async <T>(
  operation: () => Promise<T>,
  operationName: string
): Promise<T> => {
  const startTime = performance.now();
  
  try {
    const result = await operation();
    const executionTime = performance.now() - startTime;
    
    await recordPerformanceMetric({
      name: `execution_time_${operationName}`,
      value: executionTime,
      timestamp: new Date()
    });
    
    return result;
  } catch (error) {
    const executionTime = performance.now() - startTime;
    
    await recordPerformanceMetric({
      name: `execution_time_${operationName}_error`,
      value: executionTime,
      timestamp: new Date(),
      tags: { error: true }
    });
    
    throw error;
  }
};

export const getAverageResponseTime = async (hours = 24): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from('system_metrics')
      .select('metric_value')
      .like('metric_name', 'execution_time_%')
      .gte('created_at', new Date(Date.now() - hours * 60 * 60 * 1000).toISOString());

    if (error || !data?.length) return 0;

    const average = data.reduce((sum, metric) => sum + metric.metric_value, 0) / data.length;
    return Math.round(average * 100) / 100;
  } catch (error) {
    console.error('Error calculating average response time:', error);
    return 0;
  }
};
