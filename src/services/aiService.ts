
import { supabase } from '@/integrations/supabase/client';

export interface CoinAnalysisRequest {
  imageUrl: string;
  imageData?: string;
}

export interface CoinAnalysisResult {
  success: boolean;
  confidence: number;
  metadata: {
    name: string;
    country: string;
    year: number;
    denomination: string;
    composition: string;
    grade: string;
    estimatedValue: number;
    rarity: string;
    mint?: string;
    diameter?: number;
    weight?: number;
    errors?: string[];
  };
  aiProvider: string;
  processingTime: number;
}

class AIService {
  async analyzeCoinImage(request: CoinAnalysisRequest): Promise<CoinAnalysisResult> {
    const startTime = Date.now();
    
    try {
      console.log('🧠 Starting AI coin analysis...');
      
      // Call existing AI recognition endpoint
      const { data, error } = await supabase.functions.invoke('ai-coin-recognition', {
        body: {
          image: request.imageData || request.imageUrl,
          aiProvider: 'claude'
        }
      });

      if (error || !data?.success) {
        throw new Error(error?.message || 'AI analysis failed');
      }

      const processingTime = Date.now() - startTime;
      
      const result: CoinAnalysisResult = {
        success: true,
        confidence: data.analysis.confidence || 0.75,
        metadata: {
          name: data.analysis.name || 'Unknown Coin',
          country: data.analysis.country || 'Unknown',
          year: data.analysis.year || new Date().getFullYear(),
          denomination: data.analysis.denomination || 'Unknown',
          composition: data.analysis.composition || 'Unknown',
          grade: data.analysis.grade || 'Ungraded',
          estimatedValue: data.analysis.estimated_value || 0,
          rarity: data.analysis.rarity || 'Common',
          mint: data.analysis.mint,
          diameter: data.analysis.diameter,
          weight: data.analysis.weight,
          errors: data.analysis.errors
        },
        aiProvider: 'claude-enhanced',
        processingTime
      };

      console.log('✅ AI analysis completed:', result);
      return result;
      
    } catch (error: any) {
      console.error('❌ AI analysis failed:', error);
      return {
        success: false,
        confidence: 0,
        metadata: {
          name: 'Analysis Failed',
          country: 'Unknown',
          year: new Date().getFullYear(),
          denomination: 'Unknown',
          composition: 'Unknown',
          grade: 'Ungraded',
          estimatedValue: 0,
          rarity: 'Common'
        },
        aiProvider: 'claude-enhanced',
        processingTime: Date.now() - startTime
      };
    }
  }

  getConfidenceScore(result: CoinAnalysisResult): number {
    return Math.round(result.confidence * 100);
  }

  async getMetadataFromExternalSource(coinName: string): Promise<any> {
    try {
      console.log('🔍 Fetching external metadata for:', coinName);
      
      // Use existing web discovery functionality
      const { data, error } = await supabase.functions.invoke('ai-source-discovery', {
        body: {
          coinName,
          searchTerms: [coinName]
        }
      });

      if (error) {
        console.warn('External metadata fetch failed:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.warn('External metadata error:', error);
      return null;
    }
  }

  formatAnalysisForDisplay(result: CoinAnalysisResult): string {
    const { metadata } = result;
    return `${metadata.name} (${metadata.year}) - ${metadata.grade} grade ${metadata.composition} coin from ${metadata.country}. Estimated value: $${metadata.estimatedValue}. AI Confidence: ${this.getConfidenceScore(result)}%`;
  }
}

export const aiService = new AIService();
export default aiService;
