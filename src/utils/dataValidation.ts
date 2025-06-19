
import { z } from 'zod';

// Base validation schemas
export const coinSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  price: z.number().positive(),
  year: z.number().int().min(1).max(new Date().getFullYear()),
  country: z.string().min(1),
  rarity: z.enum(['common', 'uncommon', 'rare', 'very_rare', 'extremely_rare']),
  condition: z.enum(['poor', 'fair', 'good', 'very_good', 'fine', 'very_fine', 'extremely_fine', 'uncirculated']).optional(),
  category: z.enum(['ancient', 'modern', 'error_coin', 'greek', 'american', 'british', 'european', 'asian', 'gold', 'silver', 'commemorative', 'unclassified']).optional(),
  image: z.string().url(),
  user_id: z.string().uuid(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional()
});

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1),
  role: z.enum(['buyer', 'dealer', 'admin']).optional(),
  created_at: z.string().datetime().optional()
});

export const searchParamsSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  country: z.string().optional(),
  yearFrom: z.number().int().min(1).optional(),
  yearTo: z.number().int().max(new Date().getFullYear()).optional(),
  priceFrom: z.number().positive().optional(),
  priceTo: z.number().positive().optional(),
  rarity: z.string().optional(),
  condition: z.string().optional(),
  isAuction: z.boolean().optional(),
  hasImage: z.boolean().optional(),
  sortBy: z.enum(['relevance', 'price-low', 'price-high', 'year-old', 'year-new', 'name']).optional(),
  limit: z.number().int().positive().max(100).optional(),
  offset: z.number().int().min(0).optional()
});

// Validation functions
export function validateCoin(data: unknown) {
  try {
    return {
      success: true,
      data: coinSchema.parse(data),
      errors: null
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        data: null,
        errors: error.errors
      };
    }
    return {
      success: false,
      data: null,
      errors: [{ message: 'Unknown validation error' }]
    };
  }
}

export function validateUser(data: unknown) {
  try {
    return {
      success: true,
      data: userSchema.parse(data),
      errors: null
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        data: null,
        errors: error.errors
      };
    }
    return {
      success: false,
      data: null,
      errors: [{ message: 'Unknown validation error' }]
    };
  }
}

export function validateSearchParams(data: unknown) {
  try {
    return {
      success: true,
      data: searchParamsSchema.parse(data),
      errors: null
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        data: null,
        errors: error.errors
      };
    }
    return {
      success: false,
      data: null,
      errors: [{ message: 'Unknown validation error' }]
    };
  }
}

// Sanitization helpers
export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

export function sanitizeNumber(input: unknown): number | null {
  const num = Number(input);
  return isNaN(num) ? null : num;
}

export function sanitizeBoolean(input: unknown): boolean {
  if (typeof input === 'boolean') return input;
  if (typeof input === 'string') return input.toLowerCase() === 'true';
  return false;
}

// Data consistency checks
export function checkDataConsistency<T>(
  data: T[],
  requiredFields: (keyof T)[]
): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  data.forEach((item, index) => {
    requiredFields.forEach(field => {
      if (!item[field]) {
        issues.push(`Item ${index}: Missing required field '${String(field)}'`);
      }
    });
  });
  
  return {
    valid: issues.length === 0,
    issues
  };
}
