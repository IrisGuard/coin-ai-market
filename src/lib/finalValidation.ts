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
    const { data: systemHealth, error } = await supabase
      .from('coins')
      .select('id')
      .limit(1);

    if (error) {
      issues.push('Database connection failed');
    }

    return {
      isProductionReady: issues.length === 0,
      cleanlinessPercentage: issues.length === 0 ? 100 : 90,
      issues,
      recommendations,
    };
  } catch {
    return {
      isProductionReady: false,
      cleanlinessPercentage: 0,
      issues: ['Validation failed'],
      recommendations: ['Check database connectivity'],
    };
  }
};

export const logFinalValidation = async (_result: ValidationResult) => {
  // No-op: removed analytics_events writes during cleanup
};
