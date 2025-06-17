
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TranslationResult {
  translatedText: string;
  detectedLanguage?: string;
  originalText: string;
  targetLanguage: string;
}

interface LanguageDetectionResult {
  language: string;
  confidence: number;
}

export const useGoogleTranslate = () => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);

  const translateText = useCallback(async (
    text: string, 
    targetLang: string = 'en', 
    sourceLang?: string
  ): Promise<TranslationResult | null> => {
    if (!text.trim()) {
      toast.error('Please provide text to translate');
      return null;
    }

    setIsTranslating(true);
    
    try {
      console.log('🌐 Calling Google Translate API...');
      console.log('Text to translate:', text.substring(0, 100) + '...');
      console.log('Target language:', targetLang);
      console.log('Source language:', sourceLang || 'auto-detect');

      const { data, error } = await supabase.functions.invoke('google-translate', {
        body: {
          text,
          action: 'translate',
          targetLang,
          sourceLang
        }
      });

      if (error) {
        console.error('❌ Google Translate API error:', error);
        throw new Error(`Translation failed: ${error.message}`);
      }

      if (!data) {
        throw new Error('No translation data received');
      }

      console.log('✅ Translation completed:', data);

      const result: TranslationResult = {
        translatedText: data.translatedText,
        detectedLanguage: data.detectedLanguage,
        originalText: text,
        targetLanguage: targetLang
      };

      toast.success('Text translated successfully!');
      return result;

    } catch (error) {
      console.error('💥 Translation failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Translation failed';
      toast.error(errorMessage);
      return null;
    } finally {
      setIsTranslating(false);
    }
  }, []);

  const detectLanguage = useCallback(async (text: string): Promise<LanguageDetectionResult | null> => {
    if (!text.trim()) {
      toast.error('Please provide text for language detection');
      return null;
    }

    setIsDetecting(true);
    
    try {
      console.log('🔍 Detecting language for text:', text.substring(0, 100) + '...');

      const { data, error } = await supabase.functions.invoke('google-translate', {
        body: {
          text,
          action: 'detect'
        }
      });

      if (error) {
        console.error('❌ Language detection error:', error);
        throw new Error(`Language detection failed: ${error.message}`);
      }

      if (!data) {
        throw new Error('No detection data received');
      }

      console.log('✅ Language detected:', data);

      const result: LanguageDetectionResult = {
        language: data.language,
        confidence: data.confidence
      };

      return result;

    } catch (error) {
      console.error('💥 Language detection failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Language detection failed';
      toast.error(errorMessage);
      return null;
    } finally {
      setIsDetecting(false);
    }
  }, []);

  const translateCoinDescription = useCallback(async (
    description: string,
    targetLanguage: string
  ): Promise<string | null> => {
    const result = await translateText(description, targetLanguage);
    return result?.translatedText || null;
  }, [translateText]);

  return {
    translateText,
    detectLanguage,
    translateCoinDescription,
    isTranslating,
    isDetecting
  };
};
