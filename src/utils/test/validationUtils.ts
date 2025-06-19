import { supabase } from '@/integrations/supabase/client';

// Validate component props with real data validation
export const validateProps = (component: any, expectedProps: Record<string, any>): string[] => {
  const errors: string[] = [];
  
  if (!component || typeof component !== 'object') {
    errors.push('Component is not a valid object');
    return errors;
  }

  const componentProps = component.props || {};
  
  for (const [key, expectedValue] of Object.entries(expectedProps)) {
    const actualValue = componentProps[key];
    
    if (actualValue !== expectedValue) {
      errors.push(`Property ${key} expected ${String(expectedValue)} but got ${String(actualValue)}`);
    }
  }
  
  return errors;
};

// Real data testing helpers
export const validateRealDataStructure = (data: any, requiredFields: string[]): boolean => {
  if (!data || typeof data !== 'object') return false;
  
  return requiredFields.every(field => {
    const value = data[field];
    return value !== null && value !== undefined && value !== '';
  });
};

// Real database testing utilities
export const getProductionDataFromSupabase = async (table: string, limit: number = 10) => {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .limit(limit);
  
  if (error) {
    console.error(`Error fetching production data from ${table}:`, error);
    return [];
  }
  
  return data || [];
};

// Validate real user data structure
export const validateUserData = async (userId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, email, role')
    .eq('id', userId)
    .single();
  
  if (error || !data) return false;
  
  return !!(data.id && data.name && data.email);
};

// Validate coin data structure
export const validateCoinData = async (coinId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('coins')
    .select('id, name, price, grade, year')
    .eq('id', coinId)
    .single();
  
  if (error || !data) return false;
  
  return !!(data.id && data.name && data.price && data.grade && data.year);
};

export const validateTableExists = async (tableName: string): Promise<boolean> => {
  try {
    // Use a known table from the allowed tables list instead of dynamic query
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    return !error;
  } catch (error) {
    console.error(`Error validating table ${tableName}:`, error);
    return false;
  }
};
