
import { AIResult, CoinMetadata, AIConfidenceMetrics, AIAnalysisResponse } from '@/types/aiTypes';

export const formatConfidencePercentage = (confidence: number): string => {
  return `${Math.round(confidence * 100)}%`;
};

export const getConfidenceLevel = (confidence: number): 'low' | 'medium' | 'high' => {
  if (confidence < 0.4) return 'low';
  if (confidence < 0.75) return 'medium';
  return 'high';
};

export const getConfidenceBadgeColor = (confidence: number): string => {
  const level = getConfidenceLevel(confidence);
  switch (level) {
    case 'low': return 'bg-red-100 text-red-800 border-red-300';
    case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'high': return 'bg-green-100 text-green-800 border-green-300';
    default: return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

export const formatProcessingTime = (timeMs: number): string => {
  if (timeMs < 1000) return `${timeMs}ms`;
  const seconds = Math.round(timeMs / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};

export const formatEstimatedValue = (value: number, currency: string = 'USD'): string => {
  if (value === 0) return 'Value not available';
  
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  return formatter.format(value);
};

export const getRarityLevel = (rarity: string): 'common' | 'uncommon' | 'rare' | 'ultra-rare' => {
  const normalizedRarity = rarity.toLowerCase();
  
  if (normalizedRarity.includes('ultra') || normalizedRarity.includes('extremely')) {
    return 'ultra-rare';
  }
  if (normalizedRarity.includes('rare') || normalizedRarity.includes('scarce')) {
    return 'rare';
  }
  if (normalizedRarity.includes('uncommon') || normalizedRarity.includes('semi')) {
    return 'uncommon';
  }
  return 'common';
};

export const getRarityColor = (rarity: string): string => {
  const level = getRarityLevel(rarity);
  switch (level) {
    case 'ultra-rare': return 'text-purple-600 bg-purple-50 border-purple-200';
    case 'rare': return 'text-red-600 bg-red-50 border-red-200';
    case 'uncommon': return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'common': return 'text-gray-600 bg-gray-50 border-gray-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

export const calculateOverallConfidence = (metrics: AIConfidenceMetrics): number => {
  const weights = {
    identification: 0.3,
    grading: 0.25,
    valuation: 0.25,
    authentication: 0.2
  };
  
  return (
    metrics.identification * weights.identification +
    metrics.grading * weights.grading +
    metrics.valuation * weights.valuation +
    metrics.authentication * weights.authentication
  );
};

export const validateCoinMetadata = (metadata: CoinMetadata): string[] => {
  const errors: string[] = [];
  
  if (!metadata.name || metadata.name.trim() === '') {
    errors.push('Coin name is required');
  }
  
  if (!metadata.country || metadata.country.trim() === '') {
    errors.push('Country is required');
  }
  
  if (!metadata.year || metadata.year < 1 || metadata.year > new Date().getFullYear()) {
    errors.push('Valid year is required');
  }
  
  if (metadata.estimatedValue < 0) {
    errors.push('Estimated value cannot be negative');
  }
  
  return errors;
};

export const sanitizeAIResponse = (response: any): AIAnalysisResponse => {
  return {
    success: Boolean(response.success),
    confidence: Math.max(0, Math.min(1, Number(response.confidence) || 0)),
    metadata: {
      name: String(response.metadata?.name || 'Unknown Coin').trim(),
      country: String(response.metadata?.country || 'Unknown').trim(),
      year: Number(response.metadata?.year) || new Date().getFullYear(),
      denomination: String(response.metadata?.denomination || 'Unknown').trim(),
      composition: String(response.metadata?.composition || 'Unknown').trim(),
      grade: String(response.metadata?.grade || 'Ungraded').trim(),
      estimatedValue: Math.max(0, Number(response.metadata?.estimatedValue) || 0),
      rarity: String(response.metadata?.rarity || 'Common').trim(),
      mint: response.metadata?.mint ? String(response.metadata.mint).trim() : undefined,
      diameter: response.metadata?.diameter ? Number(response.metadata.diameter) : undefined,
      weight: response.metadata?.weight ? Number(response.metadata.weight) : undefined,
      errors: Array.isArray(response.metadata?.errors) ? response.metadata.errors : undefined,
      description: response.metadata?.description ? String(response.metadata.description).trim() : undefined,
      category: response.metadata?.category ? String(response.metadata.category).trim() : undefined,
      condition: response.metadata?.condition ? String(response.metadata.condition).trim() : undefined
    },
    aiProvider: String(response.aiProvider || 'unknown'),
    processingTime: Math.max(0, Number(response.processingTime) || 0),
    errors: Array.isArray(response.errors) ? response.errors : undefined,
    warnings: Array.isArray(response.warnings) ? response.warnings : undefined
  };
};

export const generateAnalysisSummary = (response: AIAnalysisResponse): string => {
  const { metadata, confidence } = response;
  const confidencePercent = formatConfidencePercentage(confidence);
  const value = formatEstimatedValue(metadata.estimatedValue);
  
  return `${metadata.name} (${metadata.year}) from ${metadata.country}. Grade: ${metadata.grade}. Estimated value: ${value}. AI confidence: ${confidencePercent}.`;
};

export const isAnalysisReliable = (response: AIAnalysisResponse): boolean => {
  return response.success && response.confidence >= 0.6 && 
         response.metadata.name !== 'Unknown Coin' &&
         response.metadata.country !== 'Unknown';
};

export const getAnalysisQualityScore = (response: AIAnalysisResponse): number => {
  let score = 0;
  
  // Base confidence score (0-40 points)
  score += response.confidence * 40;
  
  // Metadata completeness (0-30 points)
  const metadata = response.metadata;
  const fields = [metadata.name, metadata.country, metadata.denomination, metadata.composition, metadata.grade];
  const completedFields = fields.filter(field => field && field !== 'Unknown' && field !== 'Ungraded').length;
  score += (completedFields / fields.length) * 30;
  
  // Processing time bonus (0-15 points)
  if (response.processingTime < 5000) score += 15;
  else if (response.processingTime < 10000) score += 10;
  else if (response.processingTime < 20000) score += 5;
  
  // Value estimation bonus (0-15 points)
  if (metadata.estimatedValue > 0) score += 15;
  
  return Math.round(score);
};

export default {
  formatConfidencePercentage,
  getConfidenceLevel,
  getConfidenceBadgeColor,
  formatProcessingTime,
  formatEstimatedValue,
  getRarityLevel,
  getRarityColor,
  calculateOverallConfidence,
  validateCoinMetadata,
  sanitizeAIResponse,
  generateAnalysisSummary,
  isAnalysisReliable,
  getAnalysisQualityScore
};
