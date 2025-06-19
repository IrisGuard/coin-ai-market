
import { generateProductionNumber, generateProductionId } from './mockDataBlocker';

// Production-safe random utilities
export const getRandomColor = (): string => {
  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
  ];
  const index = generateProductionNumber(0, colors.length - 1);
  return colors[index];
};

export const getRandomElement = <T>(array: T[]): T => {
  const index = generateProductionNumber(0, array.length - 1);
  return array[index];
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = generateProductionNumber(0, i);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const generateUniqueId = (prefix: string = 'item'): string => {
  return generateProductionId(prefix);
};

export const getRandomPercentage = (min: number = 0, max: number = 100): number => {
  return generateProductionNumber(min, max);
};
