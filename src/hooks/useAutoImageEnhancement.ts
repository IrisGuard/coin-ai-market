
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface EnhancementOptions {
  enhancementLevel?: 'basic' | 'professional' | 'ultra';
  coinId?: string;
  autoSave?: boolean;
}

interface EnhancementResult {
  originalUrl: string;
  enhancedUrl: string;
  enhancementApplied: string[];
  qualityScore: number;
  processingTime: number;
}

export const useAutoImageEnhancement = () => {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancementHistory, setEnhancementHistory] = useState<EnhancementResult[]>([]);

  const enhanceImage = useCallback(async (
    imageUrl: string, 
    options: EnhancementOptions = {}
  ): Promise<EnhancementResult | null> => {
    if (!imageUrl || isEnhancing) return null;

    const {
      enhancementLevel = 'professional',
      coinId,
      autoSave = true
    } = options;

    setIsEnhancing(true);

    try {
      console.log('🎨 Starting automatic image enhancement...');
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Call Edge Function for professional enhancement
      const { data, error } = await supabase.functions.invoke('auto-image-enhancement', {
        body: {
          imageUrl,
          coinId,
          enhancementLevel,
          userId: user.id
        }
      });

      if (error) {
        throw error;
      }

      if (data?.success && data?.result) {
        const result: EnhancementResult = data.result;
        
        // Add to history
        setEnhancementHistory(prev => [result, ...prev]);
        
        // Show success notification
        if (autoSave) {
          toast.success(`Image enhanced successfully! Quality improved to ${result.qualityScore}%`);
        }
        
        console.log('✅ Image enhancement completed:', result);
        return result;
      } else {
        throw new Error('Enhancement failed');
      }

    } catch (err) {
      console.error('Enhancement error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Enhancement failed';
      toast.error(`Enhancement failed: ${errorMessage}`);
      return null;
    } finally {
      setIsEnhancing(false);
    }
  }, [isEnhancing]);

  const enhanceMultipleImages = useCallback(async (
    imageUrls: string[],
    options: EnhancementOptions = {}
  ): Promise<EnhancementResult[]> => {
    const results: EnhancementResult[] = [];
    
    console.log(`🚀 Starting batch enhancement of ${imageUrls.length} images`);
    
    for (const imageUrl of imageUrls) {
      const result = await enhanceImage(imageUrl, { ...options, autoSave: false });
      if (result) {
        results.push(result);
      }
      
      // Small delay between enhancements to prevent overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    if (results.length > 0) {
      toast.success(`Enhanced ${results.length} images successfully!`);
    }
    
    return results;
  }, [enhanceImage]);

  const getEnhancementStats = useCallback(() => {
    if (enhancementHistory.length === 0) {
      return null;
    }

    const totalEnhancements = enhancementHistory.length;
    const averageQuality = enhancementHistory.reduce((sum, result) => sum + result.qualityScore, 0) / totalEnhancements;
    const averageProcessingTime = enhancementHistory.reduce((sum, result) => sum + result.processingTime, 0) / totalEnhancements;
    
    return {
      totalEnhancements,
      averageQuality: Math.round(averageQuality),
      averageProcessingTime: Math.round(averageProcessingTime)
    };
  }, [enhancementHistory]);

  return {
    enhanceImage,
    enhanceMultipleImages,
    isEnhancing,
    enhancementHistory,
    getEnhancementStats
  };
};
