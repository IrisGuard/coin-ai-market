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

  // Enhanced image processing with proper base64 cleaning
  const processImageForClaude = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const result = reader.result as string;
          
          // Clean and validate base64 data
          let base64Data = result;
          
          // Remove data URL prefix if present
          if (base64Data.includes('data:image')) {
            const parts = base64Data.split('base64,');
            if (parts.length === 2) {
              base64Data = parts[1];
            }
          }
          
          // Clean whitespace and validate base64
          base64Data = base64Data.replace(/\s/g, '');
          
          // Basic base64 validation
          if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64Data)) {
            throw new Error('Invalid base64 format');
          }
          
          console.log('✅ Image processed successfully, base64 length:', base64Data.length);
          resolve(base64Data);
        } catch (error) {
          console.error('❌ Image processing failed:', error);
          reject(new Error('Failed to process image data'));
        }
      };
      
      reader.onerror = () => {
        console.error('❌ FileReader error');
        reject(new Error('Failed to read image file'));
      };
      
      // Convert to JPEG for better compatibility with Claude
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        try {
          // Set canvas size to image size
          canvas.width = img.width;
          canvas.height = img.height;
          
          // Draw image on canvas
          ctx?.drawImage(img, 0, 0);
          
          // Convert to JPEG with high quality
          canvas.toBlob((blob) => {
            if (blob) {
              const jpegReader = new FileReader();
              jpegReader.onload = () => {
                const jpegResult = jpegReader.result as string;
                const jpegBase64 = jpegResult.split('base64,')[1];
                console.log('✅ JPEG conversion successful, length:', jpegBase64.length);
                resolve(jpegBase64);
              };
              jpegReader.readAsDataURL(blob);
            } else {
              // Fallback to original file processing
              reader.readAsDataURL(file);
            }
          }, 'image/jpeg', 0.95);
        } catch (error) {
          console.error('❌ Canvas processing failed, using original file:', error);
          reader.readAsDataURL(file);
        }
      };
      
      img.onerror = () => {
        console.error('❌ Image load failed, using original file');
        reader.readAsDataURL(file);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const analyzeImage = async (imageFile: File | string): Promise<AIRecognitionResult | null> => {
    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      let imageData: string;
      
      // Enhanced image processing
      if (imageFile instanceof File) {
        console.log('🔄 Processing image file:', imageFile.name, 'Size:', imageFile.size);
        imageData = await processImageForClaude(imageFile);
      } else {
        // Clean string input
        imageData = imageFile.includes('base64,') 
          ? imageFile.split('base64,')[1] 
          : imageFile;
        imageData = imageData.replace(/\s/g, '');
      }

      console.log('📞 Calling Claude AI with processed image (length:', imageData.length, ')');
      
      // Call the anthropic coin recognition edge function with enhanced payload
      const { data, error: functionError } = await supabase.functions.invoke(
        'anthropic-coin-recognition',
        {
          body: {
            image: imageData,
            analysis_type: 'comprehensive',
            include_valuation: true,
            include_errors: true,
            image_format: 'jpeg' // Specify format for better processing
          }
        }
      );

      if (functionError) {
        console.error('❌ Edge function error:', functionError);
        
        // Enhanced error messages
        let errorMessage = 'Claude AI Analysis failed';
        if (functionError.message?.includes('credit balance')) {
          errorMessage = 'API credits exhausted. Please check your Anthropic account.';
        } else if (functionError.message?.includes('Image does not match')) {
          errorMessage = 'Image format error. Please try a different image.';
        } else if (functionError.message?.includes('API key')) {
          errorMessage = 'API key configuration error. Please check settings.';
        }
        
        throw new Error(`${errorMessage}: ${functionError.message}`);
      }

      if (!data || !data.success) {
        console.error('❌ Claude analysis unsuccessful:', data);
        const errorDetails = data?.error || 'Analysis was unsuccessful';
        throw new Error(`Claude analysis failed: ${errorDetails}`);
      }

      console.log('✅ Claude AI analysis successful:', data);

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
      
      // Enhanced success messages
      if (recognitionResult.confidence > 0.8) {
        toast.success(`🎯 Excellent identification: ${recognitionResult.name} (${Math.round(recognitionResult.confidence * 100)}% confidence)`);
      } else if (recognitionResult.confidence > 0.6) {
        toast.success(`✅ Good identification: ${recognitionResult.name} (${Math.round(recognitionResult.confidence * 100)}% confidence)`);
      } else {
        toast.warning(`⚠️ Analysis complete with ${Math.round(recognitionResult.confidence * 100)}% confidence. Results may need verification.`);
      }
      
      return recognitionResult;

    } catch (err: any) {
      console.error('💥 Claude AI recognition error:', err);
      setError(err.message);
      
      // User-friendly error messages
      let userMessage = 'Analysis failed. Please try again.';
      if (err.message?.includes('credit balance') || err.message?.includes('credits exhausted')) {
        userMessage = '💳 API credits exhausted. Please check your Anthropic account billing.';
      } else if (err.message?.includes('Image format') || err.message?.includes('does not match')) {
        userMessage = '🖼️ Image format issue. Please try uploading a clearer photo of the coin.';
      } else if (err.message?.includes('API key')) {
        userMessage = '🔑 API configuration error. Please contact support.';
      }
      
      toast.error(userMessage);
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
