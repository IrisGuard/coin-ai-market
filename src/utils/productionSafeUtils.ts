
import { generateSecureRandomNumber, generateSecureId } from './productionRandomUtils';

// Production-safe random utilities
export const getRandomColor = (): string => {
  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
  ];
  const index = generateSecureRandomNumber(0, colors.length - 1);
  return colors[index];
};

export const getRandomElement = <T>(array: T[]): T => {
  const index = generateSecureRandomNumber(0, array.length - 1);
  return array[index];
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = generateSecureRandomNumber(0, i);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const generateUniqueId = (prefix: string = 'item'): string => {
  return generateSecureId(prefix);
};

export const getRandomPercentage = (min: number = 0, max: number = 100): number => {
  return generateSecureRandomNumber(min, max);
};

// Additional production-safe utilities
export const generateMetricValue = (base: number, variance: number = 10): number => {
  const variation = generateSecureRandomNumber(-variance, variance);
  return Math.max(0, base + variation);
};

export const createTimeSeriesData = (length: number, baseValue: number): Array<{ timestamp: string; value: number }> => {
  return Array.from({ length }, (_, i) => ({
    timestamp: new Date(Date.now() - (length - 1 - i) * 3600000).toISOString(),
    value: generateMetricValue(baseValue, 15)
  }));
};

export const generateRealisticGrowthData = (periods: number, startValue: number): number[] => {
  const data = [startValue];
  for (let i = 1; i < periods; i++) {
    const growth = generateSecureRandomNumber(-5, 8) / 100;
    const nextValue = data[i - 1] * (1 + growth);
    data.push(Math.max(0, nextValue));
  }
  return data;
};
