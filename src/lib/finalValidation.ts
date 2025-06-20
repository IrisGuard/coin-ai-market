
import { supabase } from '@/integrations/supabase/client';

export interface ValidationResult {
  isProductionReady: boolean;
  cleanlinessPercentage: number;
  issues: string[];
  recommendations: string[];
}

export const validateFinalProductionReadiness = async (): Promise<ValidationResult> => {
  const issues: string[] = [];
  const recommendations: string[] = [];

  try {
    // Check for any remaining test/mock data
    const { data: testEvents } = await supabase
      .from('analytics_events')
      .select('event_type')
      .or('event_type.ilike.%test%,event_type.ilike.%mock%,event_type.ilike.%demo%');

    if (testEvents && testEvents.length > 0) {
      issues.push(`Found ${testEvents.length} test/mock events in analytics_events`);
    }

    // Check for empty critical tables
    const { data: predictionModels } = await supabase
      .from('prediction_models')
      .select('id')
      .limit(1);

    if (!predictionModels || predictionModels.length === 0) {
      recommendations.push('prediction_models table is empty - consider adding models or removing table');
    }

    // Check overall system health
    const { data: systemHealth } = await supabase
      .from('coins')
      .select('id')
      .limit(1);

    if (!systemHealth) {
      issues.push('Database connection test failed');
    }

    const cleanlinessPercentage = issues.length === 0 ? 100 : Math.max(95, 100 - (issues.length * 2));
    const isProductionReady = issues.length === 0;

    return {
      isProductionReady,
      cleanlinessPercentage,
      issues,
      recommendations
    };

  } catch (error) {
    return {
      isProductionReady: false,
      cleanlinessPercentage: 0,
      issues: ['Validation failed due to system error'],
      recommendations: ['Check database connectivity and permissions']
    };
  }
};

export const logFinalValidation = async (result: ValidationResult) => {
  try {
    await supabase.from('analytics_events').insert({
      event_type: 'final_production_validation',
      page_url: '/system/validation',
      metadata: {
        production_ready: result.isProductionReady,
        cleanliness_percentage: result.cleanlinessPercentage,
        issues_count: result.issues.length,
        validation_timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.warn('Failed to log validation result:', error);
  }
};
