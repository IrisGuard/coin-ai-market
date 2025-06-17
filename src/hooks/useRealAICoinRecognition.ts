
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AIRecognitionResult {
  name: string;
  year: number;
  country: string;
  denomination: string;
  composition: string;
  grade: string;
  estimatedValue: number;
  rarity: string;
  mint?: string;
  diameter?: number;
  weight?: number;
  errors?: string[];
  confidence: number;
  aiProvider: string;
  processingTime: number;
}

export const useRealAICoinRecognition = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AIRecognitionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeImage = async (imageFile: File | string): Promise<AIRecognitionResult | null> => {
    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      let imageData: string;
      
      // Convert File to base64 if needed
      if (imageFile instanceof File) {
        imageData = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(imageFile);
        });
      } else {
        imageData = imageFile;
      }

      console.log('Starting real AI analysis...');
      
      // Call the anthropic coin recognition edge function
      const { data, error: functionError } = await supabase.functions.invoke(
        'anthropic-coin-recognition',
        {
          body: {
            image: imageData,
            analysis_type: 'comprehensive',
            include_valuation: true,
            include_errors: true
          }
        }
      );

      if (functionError) {
        console.error('Edge function error:', functionError);
        throw new Error(`AI Analysis failed: ${functionError.message}`);
      }

      if (!data || !data.success) {
        console.error('AI analysis unsuccessful:', data);
        throw new Error(data?.error || 'AI analysis was unsuccessful');
      }

      console.log('Real AI analysis successful:', data);

      // Transform the response to match our interface
      const analysis = data.analysis;
      const recognitionResult: AIRecognitionResult = {
        name: analysis.name || 'Unknown Coin',
        year: analysis.year || new Date().getFullYear(),
        country: analysis.country || 'Unknown',
        denomination: analysis.denomination || 'Unknown',
        composition: analysis.composition || 'Unknown',
        grade: analysis.grade || 'Ungraded',
        estimatedValue: analysis.estimated_value || 0,
        rarity: analysis.rarity || 'Common',
        mint: analysis.mint,
        diameter: analysis.diameter,
        weight: analysis.weight,
        errors: analysis.errors || [],
        confidence: analysis.confidence || 0.85,
        aiProvider: data.ai_provider || 'anthropic',
        processingTime: data.processing_time || 2500
      };

      // Cache the result in our recognition cache
      if (imageFile instanceof File) {
        const imageHash = await generateImageHash(imageFile);
        await cacheRecognitionResult(imageHash, recognitionResult);
      }

      setResult(recognitionResult);
      toast.success('Real AI analysis completed successfully!');
      
      return recognitionResult;

    } catch (err: any) {
      console.error('AI recognition error:', err);
      setError(err.message);
      toast.error(`AI Analysis failed: ${err.message}`);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateImageHash = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const cacheRecognitionResult = async (imageHash: string, result: AIRecognitionResult) => {
    try {
      // Fix: Convert AIRecognitionResult to Json and use correct column name
      const { error } = await supabase.from('ai_recognition_cache').upsert({
        image_hash: imageHash,
        recognition_results: result as any, // Cast to Json type
        confidence_score: result.confidence,
        processing_time_ms: result.processingTime,
        sources_consulted: [result.aiProvider]
      });

      if (error) {
        console.error('Failed to cache recognition result:', error);
      }
    } catch (error) {
      console.error('Failed to cache recognition result:', error);
    }
  };

  const clearResults = () => {
    setResult(null);
    setError(null);
  };

  return {
    analyzeImage,
    isAnalyzing,
    result,
    error,
    clearResults
  };
};
