
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TranslationResult {
  translatedText: string;
  detectedLanguage: string;
  confidence: number;
}

export const useGoogleTranslate = () => {
  const [isTranslating, setIsTranslating] = useState(false);

  const detectLanguage = useCallback(async (text: string): Promise<string> => {
    try {
      const { data, error } = await supabase.functions.invoke('google-translate', {
        body: {
          text,
          action: 'detect'
        }
      });

      if (error) throw error;
      return data.language || 'en';
    } catch (error) {
      console.error('Language detection error:', error);
      return 'en'; // Fallback to English
    }
  }, []);

  const translateText = useCallback(async (
    text: string, 
    targetLang: string = 'en',
    sourceLang?: string
  ): Promise<TranslationResult> => {
    setIsTranslating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('google-translate', {
        body: {
          text,
          targetLang,
          sourceLang,
          action: 'translate'
        }
      });

      if (error) throw error;

      return {
        translatedText: data.translatedText || text,
        detectedLanguage: data.detectedLanguage || sourceLang || 'en',
        confidence: data.confidence || 0.9
      };
    } catch (error) {
      console.error('Translation error:', error);
      return {
        translatedText: text,
        detectedLanguage: sourceLang || 'en',
        confidence: 0
      };
    } finally {
      setIsTranslating(false);
    }
  }, []);

  const getLanguageCode = useCallback((language: string): string => {
    const languageMap: Record<string, string> = {
      'greek': 'el-GR',
      'english': 'en-US',
      'spanish': 'es-ES',
      'french': 'fr-FR',
      'german': 'de-DE',
      'italian': 'it-IT',
      'portuguese': 'pt-PT',
      'russian': 'ru-RU',
      'chinese': 'zh-CN',
      'japanese': 'ja-JP',
      'korean': 'ko-KR',
      'arabic': 'ar-SA',
      'hindi': 'hi-IN',
      'turkish': 'tr-TR',
      'dutch': 'nl-NL',
      'polish': 'pl-PL',
      'czech': 'cs-CZ',
      'swedish': 'sv-SE',
      'norwegian': 'no-NO',
      'danish': 'da-DK',
      'finnish': 'fi-FI',
      'hebrew': 'he-IL',
      'thai': 'th-TH',
      'vietnamese': 'vi-VN',
      'ukrainian': 'uk-UA',
      'romanian': 'ro-RO',
      'hungarian': 'hu-HU',
      'bulgarian': 'bg-BG',
      'croatian': 'hr-HR',
      'serbian': 'sr-RS',
      'slovenian': 'sl-SI',
      'slovak': 'sk-SK',
      'lithuanian': 'lt-LT',
      'latvian': 'lv-LV',
      'estonian': 'et-EE'
    };

    return languageMap[language.toLowerCase()] || 'en-US';
  }, []);

  return {
    detectLanguage,
    translateText,
    getLanguageCode,
    isTranslating
  };
};
