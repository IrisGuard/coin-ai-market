
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AIRecognitionResult {
  name: string;
  year: number | null;
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
      
      // Convert File to clean base64 string
      if (imageFile instanceof File) {
        imageData = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            const base64Data = result.split('base64,')[1];
            resolve(base64Data);
          };
          reader.onerror = reject;
          reader.readAsDataURL(imageFile);
        });
      } else {
        if (imageFile.includes('base64,')) {
          imageData = imageFile.split('base64,')[1];
        } else {
          imageData = imageFile;
        }
      }

      console.log('Starting Claude AI coin analysis...');
      console.log('Image data length:', imageData.length);
      
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
        throw new Error(`Claude AI Analysis failed: ${functionError.message}`);
      }

      if (!data || !data.success) {
        console.error('Claude analysis unsuccessful:', data);
        throw new Error(data?.error || 'Claude analysis was unsuccessful');
      }

      console.log('Claude AI analysis successful:', data);

      // Transform the response to match our interface
      const analysis = data.analysis;
      const recognitionResult: AIRecognitionResult = {
        name: analysis.name || 'Unidentified Coin',
        year: analysis.year,
        country: analysis.country || 'Unknown',
        denomination: analysis.denomination || 'Unknown',
        composition: analysis.composition || 'Unknown',
        grade: analysis.grade || 'Unknown',
        estimatedValue: analysis.estimated_value || 0,
        rarity: analysis.rarity || 'Unknown',
        mint: analysis.mint,
        diameter: analysis.diameter,
        weight: analysis.weight,
        errors: analysis.errors || [],
        confidence: analysis.confidence || 0.10,
        aiProvider: data.ai_provider || 'anthropic',
        processingTime: data.processing_time || 0
      };

      // Cache the result in our recognition cache
      if (imageFile instanceof File) {
        const imageHash = await generateImageHash(imageFile);
        await cacheRecognitionResult(imageHash, recognitionResult);
      }

      setResult(recognitionResult);
      
      // Display success message based on confidence
      if (recognitionResult.confidence > 0.7) {
        toast.success(`Coin identified: ${recognitionResult.name} (${Math.round(recognitionResult.confidence * 100)}% confidence)`);
      } else {
        toast.warning(`Analysis complete with ${Math.round(recognitionResult.confidence * 100)}% confidence`);
      }
      
      return recognitionResult;

    } catch (err: any) {
      console.error('Claude AI recognition error:', err);
      setError(err.message);
      toast.error(`Claude AI Analysis failed: ${err.message}`);
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
      const { error } = await supabase.from('ai_recognition_cache').upsert({
        image_hash: imageHash,
        recognition_results: result as any,
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
