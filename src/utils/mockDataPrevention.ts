
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export class MockDataPrevention {
  private static mockDataPatterns = [
    /mock/i,
    /fake/i,
    /sample/i,
    /placeholder/i,
    /test.*data/i,
    /example/i,
    /dummy/i
  ];

  static async isMockDataEnabled(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('system_config')
        .select('config_value')
        .eq('config_key', 'mock_data_enabled')
        .single();

      if (error) return false;
      return data?.config_value === true;
    } catch {
      return false;
    }
  }

  static async isProductionMode(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('system_config')
        .select('config_value')
        .eq('config_key', 'production_mode')
        .single();

      if (error) return false;
      return data?.config_value === true;
    } catch {
      return false;
    }
  }

  static containsMockData(data: any): boolean {
    const jsonString = JSON.stringify(data).toLowerCase();
    return this.mockDataPatterns.some(pattern => pattern.test(jsonString));
  }

  static async validateData(data: any, context: string = 'unknown'): Promise<boolean> {
    const isProduction = await this.isProductionMode();
    const mockEnabled = await this.isMockDataEnabled();

    if (isProduction && !mockEnabled && this.containsMockData(data)) {
      toast({
        title: "Mock Data Detected",
        description: `Mock data usage is not allowed in production mode (${context})`,
        variant: "destructive",
      });

      // Log the violation
      await supabase.rpc('log_error', {
        error_type_param: 'mock_data_violation',
        message_param: `Mock data detected in production mode: ${context}`,
        page_url_param: window.location.href,
        user_agent_param: navigator.userAgent
      });

      return false;
    }

    return true;
  }

  static async blockMockDataOperation<T>(
    operation: () => Promise<T>,
    data: any,
    context: string = 'unknown'
  ): Promise<T | null> {
    const isValid = await this.validateData(data, context);
    
    if (!isValid) {
      throw new Error(`Mock data operation blocked in production mode: ${context}`);
    }

    return await operation();
  }
}
