
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Zap, Clock } from 'lucide-react';

interface AutoImageEnhancerProps {
  imageUrl: string;
  coinId?: string;
  onEnhanced?: (enhancedUrl: string) => void;
  autoEnhance?: boolean;
  enhancementLevel?: 'basic' | 'professional' | 'ultra';
  className?: string;
}

interface EnhancementResult {
  originalUrl: string;
  enhancedUrl: string;
  enhancementApplied: string[];
  qualityScore: number;
  processingTime: number;
}

const AutoImageEnhancer: React.FC<AutoImageEnhancerProps> = ({
  imageUrl,
  coinId,
  onEnhanced,
  autoEnhance = true,
  enhancementLevel = 'professional',
  className = ''
}) => {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancementResult, setEnhancementResult] = useState<EnhancementResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const enhanceImage = async () => {
    if (!imageUrl || isEnhancing) return;
    
    setIsEnhancing(true);
    setError(null);
    
    try {
      console.log('🎨 Starting automatic image enhancement...');
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Call our Edge Function for automatic enhancement
      const { data, error: enhanceError } = await supabase.functions.invoke('auto-image-enhancement', {
        body: {
          imageUrl,
          coinId,
          enhancementLevel,
          userId: user.id
        }
      });

      if (enhanceError) {
        throw enhanceError;
      }

      if (data?.success && data?.result) {
        setEnhancementResult(data.result);
        onEnhanced?.(data.result.enhancedUrl);
        console.log('✅ Image enhancement completed successfully');
      } else {
        throw new Error('Enhancement failed');
      }

    } catch (err) {
      console.error('Enhancement error:', err);
      setError(err instanceof Error ? err.message : 'Enhancement failed');
    } finally {
      setIsEnhancing(false);
    }
  };

  // Auto-enhance on mount if enabled
  useEffect(() => {
    if (autoEnhance && imageUrl && !enhancementResult) {
      enhanceImage();
    }
  }, [autoEnhance, imageUrl]);

  if (!imageUrl) return null;

  return (
    <div className={`auto-image-enhancer ${className}`}>
      {/* Enhancement Status Display */}
      {isEnhancing && (
        <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg mb-2">
          <div className="animate-spin h-4 w-4 border-b-2 border-blue-600 rounded-full"></div>
          <span>Professional enhancement in progress...</span>
        </div>
      )}

      {/* Enhancement Result */}
      {enhancementResult && (
        <div className="enhancement-result mb-2">
          <Badge className="bg-green-100 text-green-800 text-xs mb-2">
            <Sparkles className="h-3 w-3 mr-1" />
            Enhanced • Quality: {enhancementResult.qualityScore}%
          </Badge>
          
          <div className="text-xs text-gray-600 space-y-1">
            <div>Applied: {enhancementResult.enhancementApplied.length} professional filters</div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Processed in {enhancementResult.processingTime}ms
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded mb-2">
          Enhancement failed: {error}
        </div>
      )}

      {/* Manual Enhancement Trigger */}
      {!autoEnhance && !enhancementResult && (
        <button
          onClick={enhanceImage}
          disabled={isEnhancing}
          className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1"
        >
          <Zap className="h-3 w-3" />
          Enhance Image
        </button>
      )}
    </div>
  );
};

export default AutoImageEnhancer;
